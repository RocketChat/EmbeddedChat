import React, { useState, useEffect } from 'react';
import {
  ActionButton,
  Box,
  Button,
  Input,
  Icon,
  Tooltip,
  useTheme,
} from '@embeddedchat/ui-elements';
import { getTimestampStyles } from './ChatInput.styles';

const formatOptions = [
  {
    value: 'R',
    label: 'Relative',
    description: 'Shows relative time',
    example: '2 hours ago',
  },
  {
    value: 't',
    label: 'Short Time',
    description: 'Shows only time',
    example: '12:00 AM',
  },
  {
    value: 'T',
    label: 'Long Time',
    description: 'Shows detailed time',
    example: '12:00:00 AM',
  },
  {
    value: 'd',
    label: 'Short Date',
    description: 'Shows date briefly',
    example: '12/31/2020',
  },
  {
    value: 'D',
    label: 'Long Date',
    description: 'Shows full date',
    example: 'Thursday, December 31, 2020',
  },
  {
    value: 'f',
    label: 'Full DateTime',
    description: 'Shows date and time',
    example: 'December 31, 2020 12:00 AM',
  },
  {
    value: 'F',
    label: 'Long DateTime',
    description: 'Shows detailed date and time',
    example: 'Thursday, December 31, 2020 12:00:00 AM',
  },
];

export function TimestampSelector({ onSelect }) {
  const { theme } = useTheme();
  const { mode } = useTheme();
  const styles = getTimestampStyles(theme, mode);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFormat, setSelectedFormat] = useState('f');
  const [previewTimestamp, setPreviewTimestamp] = useState('');

  useEffect(() => {
    if (isOpen) {
      const timestamp = Math.floor(selectedDate.getTime() / 1000);
      const formatted = `<t:${timestamp}:${selectedFormat}>`;
      setPreviewTimestamp(formatted);
    }
  }, [selectedDate, selectedFormat, isOpen]);

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':');
    const newDate = new Date(selectedDate);
    newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    setSelectedDate(newDate);
  };

  const handleInsert = () => {
    onSelect(previewTimestamp);
    setIsOpen(false);
  };

  return (
    <Box>
      <Tooltip text="Insert timestamp" position="top">
        <ActionButton square ghost onClick={() => setIsOpen(!isOpen)}>
          <Icon name="clock" />
        </ActionButton>
      </Tooltip>

      {isOpen && (
        <Box css={styles.timestampModal}>
          <Box css={styles.timestampModalContent}>
            <Box css={styles.modalHeader}>
              <h3>Insert Timestamp</h3>
              <ActionButton square ghost onClick={() => setIsOpen(false)}>
                <Icon name="cross" />
              </ActionButton>
            </Box>

            <Box css={styles.timestampPreview}>
              <Box css={styles.previewText}>Preview:</Box>
              <code css={styles.previewCode}>{previewTimestamp}</code>
            </Box>

            <Box css={styles.timestampInputs}>
              <Box css={styles.dateInput}>
                <Box css={styles.inputLabel}>Date</Box>
                <Input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  css={styles.inputField}
                />
              </Box>

              <Box css={styles.timeInput}>
                <Box css={styles.inputLabel}>Time</Box>
                <Input
                  type="time"
                  value={selectedDate.toTimeString().slice(0, 5)}
                  onChange={handleTimeChange}
                  css={styles.inputField}
                />
              </Box>
            </Box>

            <Box css={styles.formatSelection}>
              <Box css={styles.inputLabel}>Format</Box>
              <Box css={styles.formatOptions}>
                {formatOptions.map((format) => (
                  <Box
                    key={format.value}
                    css={[
                      styles.formatOption,
                      selectedFormat === format.value &&
                        styles.formatOptionSelected,
                    ]}
                  >
                    <input
                      type="radio"
                      id={`format-${format.value}`}
                      name="format"
                      value={format.value}
                      checked={selectedFormat === format.value}
                      onChange={() => setSelectedFormat(format.value)}
                      css={styles.formatRadio}
                    />
                    <label
                      htmlFor={`format-${format.value}`}
                      css={[
                        styles.formatLabel,
                        selectedFormat === format.value &&
                          styles.formatOptionSelected,
                      ]}
                    >
                      <Box css={styles.formatDetails}>
                        <Box css={styles.formatLabel}>{format.label}</Box>
                        <Box css={styles.formatDescription}>
                          {format.description}
                        </Box>
                        <Box css={styles.formatExample}>
                          e.g. {format.example}
                        </Box>
                      </Box>
                    </label>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box css={styles.modalFooter}>
              <Button type="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInsert}>Insert</Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
