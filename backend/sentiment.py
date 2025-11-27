
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import numpy as np
nltk.download('stopwords')
nltk.download('wordnet')
# Load model
model = load_model("sentiment_analysis_model.keras")
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))
# Load tokenizer
with open("tokenizer.pickle", "rb") as f:
    tokenizer = pickle.load(f)

MAXLEN = 100   
def preprocess_text(text):
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'#\w+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d+', '', text)
    text = text.lower()
    tokens = text.split()
    tokens = [word for word in tokens if word not in stop_words]
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    return ' '.join(tokens)
def detectSentiment(text):
    clean_text = preprocess_text(text)
    sequence = tokenizer.texts_to_sequences([clean_text])
    padded_sequence = pad_sequences(sequence, maxlen=MAXLEN, padding='post', truncating='post')
    prediction = model.predict(padded_sequence)
    predicted_class = np.argmax(prediction, axis=1)[0]
    sentiment_map = {0: 'Negative', 1: 'Positive'}
    return sentiment_map[predicted_class]
# print(predict_sentiment("I love this product!"))


