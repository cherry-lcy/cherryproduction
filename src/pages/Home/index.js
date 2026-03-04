import {useNavigate} from "react-router-dom";

import NavBar from "../../components/NavBar";
import CherryBg from "../../assets/cherry-pattern-wallpaper.webp";
import WordCloudComponent from "../../components/WordCloud";
import Footer from "../../components/Footer";
import "./index.css";

const words = [
    {text: "Piano", weight: 50},
    {text: "Kpop", weight: 50},
    {text: "Piano Arrangements", weight: 40},
    {text: "NMIXX", weight: 45},
    {text: "Girls Group", weight: 35},
    {text: "H1-KEY", weight: 30},
    {text: "Anthem", weight: 25},
    {text: "Ballad", weight: 25},
    {text: "Mix-pop", weight: 30},
    {text: "Kep1er", weight: 25},
    {text: "KISS OF LIFE", weight: 25},
    {text: "Classical Music", weight: 40},
    {text: "R&B", weight: 15},
    {text: "Rock", weight: 15},
    {text: "Youth", weight: 20},
    {text: "Passion", weight: 25},
];

const Home = () => {
    const navigate = useNavigate();

    return (<>
        <NavBar mode="light"/>
        <section>
            <img 
            class="w-100 section-image"
            src={CherryBg}
            alt="Cherry background"></img>
        </section>
        <section class="p-4 px-5">
            <h1 class="mb-4">About</h1>
            <p class="mb-3">
                Cherry Production, fueled by love, amateur arrangement and transcription.
                <br/>
                Adapt favorite K-pop songs; submissions and recommendations are welcome.
            </p>
            <p class="mb-3">
                Bilibili: CherryProduction
                <br/>
                Email: @qq.com
            </p>
        </section>
        <section class="w-100 row p-4 px-5">
            <div class="col-6">
                <WordCloudComponent words={words}/>
            </div>
            <div class="col-6">
                <section class="px-5">
                    <h1 class="mb-4">Piano Arrangements</h1>
                    <p class="mb-3">Committed to transcribing/arranging K-POP songs:</p>
                    <ul class="features mb-5">
                        <li>Preserving the original style to the fullest</li>
                        <li>Crafting playable arrangements</li>
                        <li>With rich and intricate textures</li>
                    </ul>
                    <button type="button" class="btn btn-light" onClick={()=>navigate("/search")}>Learn more</button>
                </section>
            </div>
        </section>
        <section class="w-100 p-4 px-5 pb-5">
            <h2 class="mb-4">Latest Arrangements/Transcriptions</h2>
            <div class="row position-relative">
                <div class="card col-4 song-card pointer">
                    <div class="card-body pt-4 pb-4">
                        <h4 class="card-title">Icarus</h4>
                        <h6 class="card-subtitle mb-4 text-muted">ARTMS</h6>
                        <div>
                            <span class="tag">Girl Group</span>
                            <span class="tag">Transcript</span>
                        </div>
                    </div>
                </div>
                <div style={{width: "0 !important"}}>
                    <i 
                        class="bi bi-chevron-right"
                        style={{
                            width: "auto !important",
                            position: "absolute",
                            right: "-1rem",
                            top: "50%",
                            cursor: "pointer",
                            height: "0 !important"
                        }}
                    ></i>
                </div>
            </div>
        </section>
        <Footer/>
    </>);
}

export default Home;