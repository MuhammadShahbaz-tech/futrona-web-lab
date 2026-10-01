import Scene from "../../../three/Scene";

function SceneSection() {
    return (
        <section className="threed-scene section">
            <div className="container">
                <div className="threed-scene__header">
                    <span>03 / LIVE SCENE</span>
                    <span>REAL-TIME 3D</span>
                </div>

                <div className="threed-scene__visual">
                    <Scene />
                </div>
            </div>
        </section>
    );
}

export default SceneSection;