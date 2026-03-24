import useAttachmentWindowStore from '../store/attachmentwindow';

const useDropBox = () => {
  const data = useAttachmentWindowStore((state) => state.data);
  const setData = useAttachmentWindowStore((state) => state.setData);
  const toggle = useAttachmentWindowStore((state) => state.toggle);

  const handleDrag = (e) => {
    e.preventDefault();
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    toggle();
    setData(e.dataTransfer.files[0]);
  };

  const handlePaste = (file) => {
    toggle();
    setData(file);
  };

  return {
    data,
    handleDrag,
    handleDragDrop,
    handlePaste,
  };
};

export default useDropBox;
