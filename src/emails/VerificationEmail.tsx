import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
} from '@react-email/components';

interface VerificationEmailProps {
  email: string;
  code: string;
}

export function VerificationEmail({ email, code }: VerificationEmailProps) {
  const codeDigits = code.split('').join('  ');
  const currentYear = new Date().getFullYear();

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#050505',
    color: '#EDEDED',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    padding: '40px 20px',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '40px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    letterSpacing: '2px',
    color: '#EDEDED',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '400',
    margin: '0',
    letterSpacing: '1.5px',
    color: '#666666',
    textTransform: 'uppercase',
  };

  const bodyTextStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#EDEDED',
    margin: '0 0 20px 0',
    fontWeight: '400',
  };

  const codeContainerStyle: React.CSSProperties = {
    backgroundColor: '#111111',
    border: '1px solid #FF6B00',
    borderRadius: '4px',
    padding: '32px',
    margin: '32px 0',
    textAlign: 'center',
  };

  const codeStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: '700',
    letterSpacing: '12px',
    color: '#FF6B00',
    fontFamily: 'JetBrains Mono, "Courier New", monospace',
    margin: '0',
    lineHeight: '1.4',
  };

  const expiryStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#FF6B00',
    margin: '20px 0 0 0',
    fontWeight: '500',
  };

  const emailDisplayStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666666',
    margin: '24px 0 0 0',
    fontFamily: 'JetBrains Mono, "Courier New", monospace',
    wordBreak: 'break-all',
  };

  const dividerStyle: React.CSSProperties = {
    borderColor: '#FF6B00',
    borderWidth: '1px',
    margin: '32px 0',
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '11px',
    color: '#666666',
    marginTop: '32px',
    fontWeight: '400',
  };

  const footerTextStyle: React.CSSProperties = {
    margin: '0 0 8px 0',
  };

  return (
    <Html>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Preview>Votre code de vérification SMART NUTRITION</Preview>
      <Body style={containerStyle}>
        <Container style={contentStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={titleStyle}>SMART NUTRITION</Text>
            <Text style={subtitleStyle}>SMART NUTRITION — VÉRIFICATION</Text>
          </Section>

          {/* Main Content */}
          <Section>
            <Text style={bodyTextStyle}>Votre code de vérification :</Text>

            {/* Code Display */}
            <Section style={codeContainerStyle}>
              <Text style={codeStyle}>{codeDigits}</Text>
              <Text style={expiryStyle}>Ce code expire dans 10 minutes.</Text>
              <Text style={emailDisplayStyle}>{email}</Text>
            </Section>

            {/* Additional Info */}
            <Text style={bodyTextStyle}>
              Si vous n'avez pas demandé ce code, veuillez ignorer cet e-mail.
            </Text>
          </Section>

          {/* Divider */}
          <Hr style={dividerStyle} />

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              SMART NUTRITION — Ne partagez jamais ce code.
            </Text>
            <Text style={footerTextStyle}>
              © {currentYear} SMART NUTRITION. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default VerificationEmail;
