const scrollToMessage = (messageId) => {
  requestAnimationFrame(() => {
    const element = document.getElementById(messageId);

    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  });
};

export default scrollToMessage;
