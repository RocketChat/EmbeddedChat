import React, { useState, useMemo, useEffect } from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import i18n from '@embeddedchat/i18n';
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
  const [selectedFilter, setSelectedFilter] = useState('all');

  const options = [
    { value: 'all', label: i18n.t('All') },
    { value: 'application', label: i18n.t('Files') },
    { value: 'video', label: i18n.t('Videos') },
    { value: 'image', label: i18n.t('Images') },
    { value: 'audio', label: i18n.t('Audios') },
    { value: 'text', label: i18n.t('Texts') },
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
      const res = await RCInstance.getAllFiles(isChannelPrivate, '');
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
    setSelectedFilter(val);
    let res;
    val === 'all'
      ? (res = await RCInstance.getAllFiles(isChannelPrivate, ''))
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
      title={i18n.t('Files')}
      iconName="attachment"
      noMessageInfo={i18n.t('No_Files_Found')}
      filterProps={{
        isFile: true,
        options,
        value: selectedFilter,
        handleFilterSelect,
      }}
      searchProps={{
        isSearch: true,
        handleInputChange,
        placeholder: i18n.t('Search_Files'),
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
