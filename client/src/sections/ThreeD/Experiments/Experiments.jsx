function Experiments({
    activeExperiment,
    setActiveExperiment,
}) {

    const experiments = [
        {
            id: "scene",
            number: "01",
            title: "SCENE",
            description:
                "Building interactive 3D environments with objects, cameras, and spatial composition.",
        },
        {
            id: "materials",
            number: "02",
            title: "MATERIALS",
            description:
                "Exploring surfaces, textures, lighting, and real-time visual properties.",
        },
        {
            id: "camera",
            number: "03",
            title: "CAMERA",
            description:
                "Creating depth and perspective through controlled camera movement.",
        },
        {
            id: "interaction",
            number: "04",
            title: "INTERACTION",
            description:
                "Connecting user input with objects, movement, and spatial behavior.",
        },
    ];

    return (
        <section className="threed-experiments section">
            <div className="container">
                <div className="threed-experiments__header">
                    <span>02 / EXPERIMENTS</span>

                    <p>
                        Exploring depth,
                        <br />
                        space and interaction.
                    </p>
                </div>

                <div className="threed-experiments__list">
                    {experiments.map((experiment) => (
                        <article
                            key={experiment.id}
                            className={`threed-experiment ${
                                activeExperiment === experiment.id
                                    ? "is-active"
                                    : ""
                            }`}
                            onClick={() =>
                                setActiveExperiment(experiment.id)
                            }
                        >
                            <span className="threed-experiment__number">
                                {experiment.number}
                            </span>

                            <div className="threed-experiment__info">
                                <h3>{experiment.title}</h3>

                                <p>{experiment.description}</p>
                            </div>

                            <span className="threed-experiment__arrow">
                                ↗
                            </span>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Experiments;