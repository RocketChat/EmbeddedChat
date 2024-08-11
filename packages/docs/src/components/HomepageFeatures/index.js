import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Easy from '../../assets/easy.png'
import Pencil from '../../assets/pencil.png'
import App from '../../assets/app.png'

const FeatureList = [
  {
    title: "Easy to Use",
    src: Easy,
    description: (
      <>
        Embedded was developed to easily integrate Rocket.Chat with your React
        Application.
      </>
    ),
  },
  {
    title: "SDK Driven UI",
    src: App,
    description: (
      <>
        The component uses the Rocket.Chat SDK for tight integration and
        features a fully custom-built UI, ensuring a cohesive and integrated
        user experience.
      </>
    ),
  },
  {
    title: "Customization",
    src: Pencil,
    description: (
      <>
        Tailor the chat window's appearance and functionality with pre-built
        designs, login options, and extensibility features.
      </>
    ),
  },
];

function Feature({ src, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img src={src} width={'100'} height={'100'} alt="notfound"/>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
