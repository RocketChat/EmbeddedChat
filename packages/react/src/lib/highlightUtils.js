const highlightText = (text, searchTerm) => {
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  const result = [];

  parts.forEach((part) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      result.push({ type: 'HIGHLIGHT_TEXT', value: part });
    } else {
      result.push({ type: 'PLAIN_TEXT', value: part });
    }
  });

  return result;
};

export function highlightSearchTerm(messagesArr, searchedWords) {
  const searchTerms = Array.isArray(searchedWords)
    ? searchedWords
    : [searchedWords];

  return messagesArr.map((message) => {
    if (message.md) {
      message.md = message.md.map((paragraphBlock) => {
        if (paragraphBlock.type === 'PARAGRAPH') {
          const updatedValue = paragraphBlock.value.reduce(
            (accumulatedValue, content) => {
              if (content.type === 'PLAIN_TEXT') {
                let updatedContent = content.value;
                searchTerms.forEach((searchTerm) => {
                  if (searchTerm && updatedContent) {
                    accumulatedValue.push(
                      ...highlightText(updatedContent, searchTerm)
                    );
                    updatedContent = '';
                  }
                });

                if (updatedContent) {
                  accumulatedValue.push({
                    type: 'PLAIN_TEXT',
                    value: updatedContent,
                  });
                }
              } else if (content.type === 'LINK') {
                const updatedLabel = content.value.label.reduce(
                  (labelAccumulatedValue, labelContent) => {
                    if (labelContent.type === 'PLAIN_TEXT') {
                      let updatedLabelContent = labelContent.value;
                      searchTerms.forEach((searchTerm) => {
                        if (searchTerm && updatedLabelContent) {
                          labelAccumulatedValue.push(
                            ...highlightText(updatedLabelContent, searchTerm)
                          );
                          updatedLabelContent = '';
                        }
                      });

                      if (updatedLabelContent) {
                        labelAccumulatedValue.push({
                          type: 'PLAIN_TEXT',
                          value: updatedLabelContent,
                        });
                      }
                    } else {
                      labelAccumulatedValue.push(labelContent);
                    }

                    return labelAccumulatedValue;
                  },
                  []
                );

                accumulatedValue.push({
                  ...content,
                  value: {
                    ...content.value,
                    label: updatedLabel,
                  },
                });
              } else if (content.type === 'INLINE_CODE') {
                let updatedContent = content.value.value;
                searchTerms.forEach((searchTerm) => {
                  if (searchTerm && updatedContent) {
                    accumulatedValue.push(
                      ...highlightText(updatedContent, searchTerm)
                    );
                    updatedContent = '';
                  }
                });

                if (updatedContent) {
                  accumulatedValue.push({
                    type: 'INLINE_CODE',
                    value: { type: 'PLAIN_TEXT', value: updatedContent },
                  });
                }
              } else if (['STRIKE', 'BOLD', 'ITALIC'].includes(content.type)) {
                const updatedContents = content.value.reduce(
                  (innerAccumulatedValue, innerContent) => {
                    if (innerContent.type === 'PLAIN_TEXT') {
                      let updatedContent = innerContent.value;
                      searchTerms.forEach((searchTerm) => {
                        if (searchTerm && updatedContent) {
                          innerAccumulatedValue.push(
                            ...highlightText(updatedContent, searchTerm)
                          );
                          updatedContent = '';
                        }
                      });

                      if (updatedContent) {
                        innerAccumulatedValue.push({
                          type: 'PLAIN_TEXT',
                          value: updatedContent,
                        });
                      }
                    } else {
                      innerAccumulatedValue.push(innerContent);
                    }

                    return innerAccumulatedValue;
                  },
                  []
                );

                accumulatedValue.push({
                  ...content,
                  value: updatedContents,
                });
              } else {
                accumulatedValue.push(content);
              }

              return accumulatedValue;
            },
            []
          );

          return {
            ...paragraphBlock,
            value: updatedValue,
          };
        }

        return paragraphBlock;
      });
    }

    return message;
  });
}
