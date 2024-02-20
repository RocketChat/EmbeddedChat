import React from "react";
import ReactDOM from "react-dom/client";
import { EmbeddedChat as EmbeddedChatComponent } from "@embeddedchat/react";

const EmbeddedChat = {
  renderInElementWithId(config, id) {
    if (!id) {
      throw new Error(
        "Please provide a valid id of the element to render embeddedchat"
      );
    }
    ReactDOM.createRoot(document.getElementById(id)).render(
      <React.StrictMode>
        <EmbeddedChatComponent {...config} />
      </React.StrictMode>
    );
  },
  renderInElementWithSelector(config, selector) {
    if (!selector) {
      throw new Error("Please provide a valid selector to render embeddedchat");
    }
    ReactDOM.createRoot(document.querySelector(selector)).render(
      <React.StrictMode>
        <EmbeddedChatComponent {...config} />
      </React.StrictMode>
    );
  },
  renderInElement(config, element) {
    if (!element) {
      throw new Error("Please provide a valid element to render embeddedchat");
    }
    ReactDOM.createRoot(element).render(
      <React.StrictMode>
        <EmbeddedChatComponent {...config} />
      </React.StrictMode>
    );
  },
};
export default EmbeddedChat;
