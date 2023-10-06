import { useComponentOverrides } from '../../theme/useComponentOverrides'; 

export const MessageBody = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageBody',
    className,
    style
  );

  return (
    <Box
      css={MessageBodyCss}
      className={appendClassNames('ec-message-body', classNames)}
      style={styleOverrides}
      {...props}
    >
      <p>{children}</p>
    </Box>
  );
};