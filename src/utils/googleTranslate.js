import axios from "axios";

const API_KEY = "AIzaSyAQeLJGe64GuyR60W10T72q3cSG9yIRV-k";
const API_URL = "https://translation.googleapis.com/language/translate/v2";

const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      q: text,
      target: targetLanguage,
    });

    return response?.data?.data?.translations?.[0]?.translatedText;
  } catch (error) {
    console.log("translate error", error);
    return null;
  }
};

export default translateText;
