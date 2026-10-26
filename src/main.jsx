import ReactDOM from "react-dom/client";
import "./index.css";
import { Layout } from "./components/Layout";
import { Scroll } from "./components/Scroll";
import { SiteBackground } from "./components/SiteBackground";
import { Home } from "./pages";

const rootElement = document.getElementById("app");

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <>
      <SiteBackground />
      <Scroll>
        <Layout>
          <Home />
        </Layout>
      </Scroll>
    </>
  );
}
