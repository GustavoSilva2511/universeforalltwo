import "./HomePage.css"

import ApodInfo from "../../components/apod/ApodInfo"
import TextInput from "../../components/ui/TextInput"
import PageLayout from "../../components/layout/PageLayout"

import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { useState } from "react"
import { ROUTES } from "../../constants/routes"

export default function HomePage() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    function verify(Today, Date) {
        const today = Today.split("-");
        const date = Date.split("-");

        if (parseInt(date[0]) < parseInt(today[0])){
            setError("");
            return true;
        }

        if ((date[0]) == today[0] && parseInt(date[1]) < parseInt(today[1])){
            setError("");
            return true;
        }

        if (date[0] == today[0] && date[1] == today[1] && parseInt(date[2]) < parseInt(today[2])){
            setError("");
            return true;
        }

        if (date[0] == today[0] && date[1] == today[1] && date[2] == today[2]) {
            setError("Maybe today not yet have a content, try later!")
            return true;
        }

        setError("Date not exist, please, put a valid date!");
        return false;
    }

    const getDate = async () => {
        const timeElapsed = Date.now();
        const date = new Date(timeElapsed);
        const today = date.toISOString().split("T");

        if(verify(today[0], localStorage.getItem("date"))){
            const url = "https://api.nasa.gov/planetary/apod?api_key=" + process.env.APOD_TOKEN + "&date=" + localStorage.getItem("date");
            const res = await axios.get(url);
            const data = await res.data;
            localStorage.setItem("title", data.title)
            localStorage.setItem("explanation", data.explanation)
            localStorage.setItem("url", data.url)
            navigate(ROUTES.CONTENT)
        }
      }

    return (
        <PageLayout>
            <div className="main">
                <div className="section">
                    <ApodInfo
                        title="Wellcome people"
                        description="inset a date bellow and appreciate"
                    />
                    <div>
                        <TextInput
                            type="date"
                            placeholder="choice a date..."
                            onChange={(e) => {localStorage.setItem("date", e.target.value)}}
                        />
                        <p className="error">{error}</p>
                        <button onClick={getDate}>continue</button>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
