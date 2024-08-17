import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyABIu2OJZtCb_W8XKKW3azbHQqspot91RU",
  authDomain: "live-wallpaper-2eb55.firebaseapp.com",
  projectId: "live-wallpaper-2eb55",
  storageBucket: "live-wallpaper-2eb55.appspot.com",
  messagingSenderId: "806352875609",
  appId: "1:806352875609:web:eb93beeada50a9e6154148",
  measurementId: "G-LC6K7ZDGT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
