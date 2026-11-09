import re
import string
import numpy as np
import pandas as pd
import nltk
from gensim.utils import simple_preprocess

from sklearn.base import BaseEstimator, TransformerMixin
from gensim.models import Word2Vec
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

words = stopwords.words('english')
punch = string.punctuation
ps = PorterStemmer()

import math
import ipaddress
import tldextract

from urllib.parse import urlparse
from collections import Counter


# Extract registered domain, subdomain, and URL parts
def get_domain_length(url):
    try:
        ext = tldextract.extract(url)
        return len(ext.domain)
    except Exception:
        return 0


def get_subdomain_count(url):
    try:
        ext = tldextract.extract(url)
        return len(ext.subdomain.split('.')) if ext.subdomain else 0
    except Exception:
        return 0


def get_url_parts(url):
    try:
        parsed = urlparse(url if '://' in url else '//' + url)
        return parsed
    except ValueError:
        return None


def get_path_length(url):
    parsed = get_url_parts(url)
    return len(parsed.path) if parsed else 0


def get_slash_count(url):
    return url.count('/')


def get_special_char_count(url):
    special_chars = ['@', '?', '&', '=', '-', '_', '~', '!', '*', '$']
    return sum(url.count(char) for char in special_chars)


def get_digit_count(url):
    return sum(char.isdigit() for char in url)


def get_uppercase_ratio(url):
    letters = [char for char in url if char.isalpha()]
    if not letters:
        return 0
    return sum(char.isupper() for char in letters) / len(letters)


def calculate_entropy(value):
    if not value:
        return 0

    counts = Counter(value)
    length = len(value)

    return -sum(
        (count / length) * math.log2(count / length)
        for count in counts.values()
    )


def get_domain_entropy(url):
    try:
        ext = tldextract.extract(url)
        domain = ext.domain
        return calculate_entropy(domain)
    except Exception:
        return 0


def get_path_entropy(url):
    parsed = get_url_parts(url)
    return calculate_entropy(parsed.path) if parsed else 0


def get_encoded_count(url):
    return len(re.findall(r'%[0-9a-fA-F]{2}', url))


def get_domain_hyphen(url):
    try:
        ext = tldextract.extract(url)
        return int('-' in ext.domain)
    except Exception:
        return 0


def get_ip_host(url):
    parsed = get_url_parts(url)
    if not parsed:
        return 0

    hostname = parsed.hostname
    if not hostname:
        return 0

    try:
        ipaddress.ip_address(hostname)
        return 1
    except ValueError:
        return 0


def get_suspicious_keywords(url):
    keywords = [
        'paypal', 'apple', 'netflix', 'bank',
        'login', 'verify', 'secure', 'update'
    ]
    url_lower = url.lower()
    return sum(url_lower.count(keyword) for keyword in keywords)


class CustomFeatureEngineer(BaseEstimator, TransformerMixin):

    def __init__(self, rare_threshold=10):
        self.rare_threshold = rare_threshold

    def fit(self, X, y=None):
        # Learn rare sender extensions from training data
        extensions = (
            X['sender'].fillna('')
            .str.lower()
            .str.extract(r'@[^@]+\.([a-z]{2,})$', expand=False)
        )

        extension_counts = extensions.value_counts()

        self.rare_extensions_ = set(
            extension_counts[
                extension_counts <= self.rare_threshold
            ].index
        )

        return self

    def transform(self, X):
        X = X.copy()

        text = X['text'].fillna('')
        subject = X['subject'].fillna('')

        # 1. Non-alphanumeric ratio - body
        X['non_alphanumeric_ratio_body'] = text.apply(
            lambda t: sum(not c.isalnum() for c in t) / len(t)
            if t else 0
        )

        # 2. Non-alphanumeric ratio - subject
        X['non_alphanumeric_ratio_subject'] = subject.apply(
            lambda t: sum(not c.isalnum() for c in t) / len(t)
            if t else 0
        )

        # 3. Lexical diversity - body
        X['lexical_diversity_body'] = text.str.split().apply(
            lambda tokens: len(set(tokens)) / len(tokens)
            if tokens else 0
        )

        # 4. Digit ratio - body
        X['digit_ratio_body'] = text.apply(
            lambda t: sum(c.isdigit() for c in t) / len(t)
            if t else 0
        )

        # 5. Digit ratio - subject
        X['digit_ratio_subject'] = subject.apply(
            lambda t: sum(c.isdigit() for c in t) / len(t)
            if t else 0
        )

        # 6. Consecutive spaces count - body
        X['consecutive_spaces_count_body'] = text.apply(
            lambda t: len(re.findall(r'(?<! )  +', t))
        )

        # 7. Total words - body
        X['total_words_body'] = text.apply(
            lambda t: len(nltk.word_tokenize(t))
        )

        # 8. Total words - subject
        X['total_words_subject'] = subject.apply(
            lambda t: len(nltk.word_tokenize(t))
        )

        # 9. URL count - body
        X['url_count_body'] = text.apply(
            lambda t: len(re.findall(r'https?://\S+|www\.\S+', t))
        )

        # 10. Uppercase ratio - body
        X['uppercase_ratio_body'] = text.apply(
            lambda t: sum(c.isupper() for c in t) / len(t)
            if t else 0
        )

        # 11. Uppercase ratio - subject
        X['uppercase_ratio_subject'] = subject.apply(
            lambda t: sum(c.isupper() for c in t) / len(t)
            if t else 0
        )

        # 12. Sender domain extension
        extensions = (
            X['sender'].fillna('')
            .str.lower()
            .str.extract(r'@[^@]+\.([a-z]{2,})$', expand=False)
        )

        X['sender_domain_extension'] = extensions.fillna('').apply(
            lambda ext: 'other'
            if ext in self.rare_extensions_ else ext
        )

        # 13. Average word length - body
        X['avg_word_length'] = text.str.split().apply(
            lambda tokens: sum(len(token) for token in tokens) / len(tokens)
            if tokens else 0
        )

        # Extract URLs from the text
        X['extracted_urls'] = text.apply(
            lambda t: re.findall(r'https?://\S+|www\.\S+', t)
        )

        # 14. Maximum URL length
        X['max_url_length'] = X['extracted_urls'].apply(
            lambda urls: max((len(url) for url in urls), default=0)
        )

        # 15. Maximum domain length
        X['max_domain_length'] = X['extracted_urls'].apply(
            lambda urls: max(
                (get_domain_length(url) for url in urls), default=0
            )
        )

        # 16. Maximum path length
        X['max_path_length'] = X['extracted_urls'].apply(
            lambda urls: max((get_path_length(url) for url in urls), default=0)
        )

        # 17. Maximum slash count
        X['max_slash_count'] = X['extracted_urls'].apply(
            lambda urls: max((get_slash_count(url) for url in urls), default=0)
        )

        # 18. Maximum special character count
        X['special_chars_max'] = X['extracted_urls'].apply(
            lambda urls: max(
                (get_special_char_count(url) for url in urls), default=0
            )
        )

        # 19. Maximum digit count
        X['max_digit_count'] = X['extracted_urls'].apply(
            lambda urls: max((get_digit_count(url) for url in urls), default=0)
        )

        # 20. Maximum uppercase ratio
        X['max_uppercase_ratio'] = X['extracted_urls'].apply(
            lambda urls: max(
                (get_uppercase_ratio(url) for url in urls), default=0
            )
        )

        # 21. Maximum domain entropy
        X['max_domain_entropy'] = X['extracted_urls'].apply(
            lambda urls: max(
                (get_domain_entropy(url) for url in urls), default=0
            )
        )

        # 22. Maximum path entropy
        X['max_path_entropy'] = X['extracted_urls'].apply(
            lambda urls: max(
                (get_path_entropy(url) for url in urls), default=0
            )
        )

        # 23. Maximum subdomain count
        X['max_subdomain_count'] = X['extracted_urls'].apply(
            lambda urls: max(
                (get_subdomain_count(url) for url in urls), default=0
            )
        )

        # 24. Maximum domain hyphen flag
        X['max_domain_hyphen'] = X['extracted_urls'].apply(
            lambda urls: max((get_domain_hyphen(url) for url in urls), default=0)
        )

        # 25. Maximum IP-host flag
        X['max_ip_host'] = X['extracted_urls'].apply(
            lambda urls: max((get_ip_host(url) for url in urls), default=0)
        )

        # 26. Maximum suspicious keyword count
        X['max_suspicious_keywords'] = X['extracted_urls'].apply(
            lambda urls: max(
                (get_suspicious_keywords(url) for url in urls), default=0
            )
        )

        # Temporary column used only for feature engineering
        X.drop(columns=['extracted_urls'], inplace=True)

        return X





class NLPPreprocessor(BaseEstimator, TransformerMixin):

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()

        # Combine text and subject into Text
        X['Text'] = X['text'] + ' ' + X['subject']

        # NLP preprocessing function
        def transform_text(text):
            # lowercase
            text = text.lower()

            # remove URLs
            pattern = re.compile(r'https?://\S+|www\.\S+')
            text = pattern.sub('', text)

            # tokenization
            text = nltk.word_tokenize(text)

            # removing special characters
            y = []
            for i in text:
                if i.isalnum():
                    y.append(i)

            # removing stop words and punctuation
            text = y[:]
            y.clear()

            for i in text:
                if i not in words and i not in punch:
                    y.append(i)

            # stemming
            text = y[:]
            y.clear()

            for i in text:
                y.append(ps.stem(i))

            return " ".join(y)

        # Apply preprocessing to Text column
        X['transform_text'] = X['Text'].apply(transform_text)

        # Drop unwanted columns
        X.drop(
            columns=['Text', 'text', 'subject', 'sender', 'receiver'],
            errors='ignore',
            inplace=True
        )
        return X





class Word2VecTransformer(BaseEstimator, TransformerMixin):

    def __init__(
        self,
        vector_size=100,
        window=5,
        min_count=2,
        sg=1,
        epochs=10
    ):
        self.vector_size = vector_size
        self.window = window
        self.min_count = min_count
        self.sg = sg
        self.epochs = epochs

    def fit(self, X, y=None):

        if not isinstance(X, pd.DataFrame):                     # Checks whether X is a Pandas DataFrame. 
            X = pd.DataFrame(X, columns=['transform_text'])

        sentences = []

        for text in X['transform_text']:
            words = simple_preprocess(str(text))
            if words:
                sentences.append(words)

        self.w2v_ = Word2Vec(
            sentences=sentences,
            vector_size=self.vector_size,
            window=self.window,
            min_count=self.min_count,
            sg=self.sg,
            epochs=self.epochs,
            workers=4,
            seed=42
        )

        return self

    def transform(self, X):

        if not isinstance(X, pd.DataFrame):
            X = pd.DataFrame(X, columns=['transform_text'])

        result = []

        for text in X['transform_text']:
            words = simple_preprocess(str(text))
            vectors = []

            for word in words:
                if word in self.w2v_.wv:
                    vectors.append(self.w2v_.wv[word])

            if len(vectors) == 0:
                email_vector = np.zeros(self.vector_size)
            else:
                email_vector = np.mean(vectors, axis=0)

            result.append(email_vector)

        return np.array(result)


