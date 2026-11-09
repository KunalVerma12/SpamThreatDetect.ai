
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
from nltk.stem import WordNetLemmatizer

words = stopwords.words('english')
punch = string.punctuation

# Lemmatization
lemm = WordNetLemmatizer()


# NLP preprocessing function (outside the class)
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

    # removing stopwords and punctuation
    text = y[:]
    y.clear()

    for i in text:
        if i not in words and i not in punch:
            y.append(i)

    # lemmatization
    text = y[:]
    y.clear()

    for i in text:
        y.append(lemm.lemmatize(i))

    return " ".join(y)


# NLPPreprocessor class
class NLPPreprocessor(BaseEstimator, TransformerMixin):

    def fit(self, X, y=None):
        return self

    def transform(self, X):

        X = X.copy()
        X['Text'] = X['text']

        # Apply preprocessing
        X['transform_text'] = X['Text'].apply(transform_text)

        # Drop unwanted columns
        X.drop(
            columns=['text', 'Text'],
            errors='ignore',
            inplace=True
        )

        return X
