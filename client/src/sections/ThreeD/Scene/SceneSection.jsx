import Scene from "../../../three/Scene";

function SceneSection({ activeExperiment }) {
    return (
        <section className="threed-scene section">
            <div className="container">
                <div className="threed-scene__header">
                    <span>03 / LIVE SCENE</span>
                    {/* <span>REAL-TIME 3D</span> */}
                    <span>{activeExperiment.toUpperCase()}</span>
                </div>

                <div className="threed-scene__visual">
                    <Scene 
                        activeExperiment={activeExperiment}
                    />
                </div>
            </div>
        </section>
    );
}

export default SceneSection;