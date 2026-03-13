import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
  Button,
} from '@react-email/components';

interface PasswordResetEmailProps {
  email: string;
  resetUrl: string;
}

export function PasswordResetEmail({ email, resetUrl }: PasswordResetEmailProps) {
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

  const ctaContainerStyle: React.CSSProperties = {
    backgroundColor: '#111111',
    border: '1px solid #FF6B00',
    borderRadius: '4px',
    padding: '32px',
    margin: '32px 0',
    textAlign: 'center',
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
    margin: '16px 0 0 0',
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

  const warningStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666666',
    margin: '0',
    lineHeight: '1.5',
  };

  return (
    <Html>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Preview>Réinitialisation de votre mot de passe SMART NUTRITION</Preview>
      <Body style={containerStyle}>
        <Container style={contentStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={titleStyle}>SMART NUTRITION</Text>
            <Text style={subtitleStyle}>RÉINITIALISATION DU MOT DE PASSE</Text>
          </Section>

          {/* Main Content */}
          <Section>
            <Text style={bodyTextStyle}>
              Vous avez demandé la réinitialisation de votre mot de passe.
              Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
            </Text>

            {/* CTA */}
            <Section style={ctaContainerStyle}>
              <Button
                href={resetUrl}
                style={{
                  backgroundColor: '#FF6B00',
                  color: '#FFFFFF',
                  fontFamily: 'JetBrains Mono, "Courier New", monospace',
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '14px 32px',
                  borderRadius: '2px',
                  display: 'inline-block',
                }}
              >
                RÉINITIALISER MON MOT DE PASSE
              </Button>
              <Text style={expiryStyle}>Ce lien expire dans 10 minutes.</Text>
              <Text style={emailDisplayStyle}>{email}</Text>
            </Section>

            {/* Security note */}
            <Text style={warningStyle}>
              Si vous n'avez pas demandé cette réinitialisation, ignorez cet
              e-mail — votre mot de passe reste inchangé.
            </Text>
          </Section>

          {/* Divider */}
          <Hr style={dividerStyle} />

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              SMART NUTRITION — Ne partagez jamais ce lien.
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

export default PasswordResetEmail;
