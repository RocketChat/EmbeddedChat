import React, { useState, useMemo, useEffect } from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import { useChannelStore, useMessageStore } from '../../store';
import { useRCContext } from '../../context/RCInstance';
import { MessageAggregator } from './common/MessageAggregator';

const FileGallery = () => {
  const { RCInstance } = useRCContext();
  const { variantOverrides } = useComponentOverrides('FileGallery');
  const viewType = variantOverrides.viewType || 'Sidebar';

  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);
  const messages = useMessageStore((state) => state.messages);

  const [text, setText] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [files, setFiles] = useState([]);

  const options = [
    { value: 'all', label: 'All' },
    { value: 'application', label: 'Files' },
    { value: 'video', label: 'Videos' },
    { value: 'image', label: 'Images' },
    { value: 'audio', label: 'Audios' },
    { value: 'text', label: 'Texts' },
  ];

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const filteredFiles = useMemo(
    () =>
      files.filter((file) =>
        file.name?.toLowerCase().includes(text.toLowerCase())
      ),
    [files, text]
  );

  useEffect(() => {
    const fetchAllFiles = async () => {
      const res = await RCInstance.getAllFiles(isChannelPrivate);
      if (res?.files) {
        const sortedFiles = res.files.sort(
          (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );
        setFiles(sortedFiles);
        setIsFetching(false);
      }
    };
    fetchAllFiles();
  }, [RCInstance, isChannelPrivate, messages]);

  const handleFilterSelect = async (val) => {
    setIsFetching(true);
    let res;
    val === 'all'
      ? (res = await RCInstance.getAllFiles(isChannelPrivate))
      : (res = await RCInstance.getAllFiles(isChannelPrivate, val));
    if (res?.files) {
      const sortedFiles = res.files.sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );
      setFiles(sortedFiles);
      setIsFetching(false);
    }
  };

  return (
    <MessageAggregator
      title="Files"
      iconName="attachment"
      noMessageInfo="No Files Found"
      filterProps={{
        isFile: true,
        options,
        value: 'all',
        handleFilterSelect,
      }}
      searchProps={{
        isSearch: true,
        handleInputChange,
        placeholder: 'Search Files',
      }}
      fetching={isFetching}
      shouldRender={(file) => file.path}
      type="file"
      searchFiltered={filteredFiles}
      viewType={viewType}
    />
  );
};

export default FileGallery;
