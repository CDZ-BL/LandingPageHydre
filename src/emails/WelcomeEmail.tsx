/**
 * Welcome Email — Waitlist Confirmation
 * V4.0.0-HYDRE-APEX Compliant
 *
 * React Email component rendered server-side by Resend.
 * Minimal, on-brand design matching the HYDRE aesthetic.
 */

import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface WelcomeEmailProps {
    readonly email: string;
}

export function WelcomeEmail({ email }: WelcomeEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Bienvenue dans l'Alliance HYDRE</Preview>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>
                    <Section style={headerStyle}>
                        <Text style={logoStyle}>HYDRE</Text>
                        <Text style={batchStyle}>AETHER [LABS] — BATCH 001</Text>
                    </Section>

                    <Hr style={hrStyle} />

                    <Heading style={headingStyle}>
                        Bienvenue dans l'Alliance.
                    </Heading>

                    <Text style={textStyle}>
                        Vous êtes désormais sur la liste d'accès prioritaire.
                        Nous vous contacterons dès que HYDRE sera disponible.
                    </Text>

                    <Text style={metaStyle}>
                        Email enregistré : {email}
                    </Text>

                    <Hr style={hrStyle} />

                    <Text style={footerStyle}>
                        HYDRE — L'hydratation épurée.
                        <br />
                        Pour vous. Pas pour le marketing.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

// ─────────────────────────────────────────────────────────────
// INLINE STYLES — Email clients don't support CSS classes
// ─────────────────────────────────────────────────────────────

const bodyStyle: React.CSSProperties = {
    backgroundColor: '#050505',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    margin: 0,
    padding: 0,
};

const containerStyle: React.CSSProperties = {
    maxWidth: '560px',
    margin: '0 auto',
    padding: '40px 24px',
};

const headerStyle: React.CSSProperties = {
    textAlign: 'center' as const,
    marginBottom: '32px',
};

const logoStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '28px',
    fontWeight: 700,
    letterSpacing: '0.3em',
    margin: 0,
};

const batchStyle: React.CSSProperties = {
    color: '#666666',
    fontSize: '10px',
    letterSpacing: '0.2em',
    fontFamily: 'monospace',
    marginTop: '4px',
};

const hrStyle: React.CSSProperties = {
    borderColor: '#222222',
    margin: '24px 0',
};

const headingStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.3,
};

const textStyle: React.CSSProperties = {
    color: '#999999',
    fontSize: '15px',
    lineHeight: 1.6,
};

const metaStyle: React.CSSProperties = {
    color: '#555555',
    fontSize: '12px',
    fontFamily: 'monospace',
    marginTop: '16px',
};

const footerStyle: React.CSSProperties = {
    color: '#444444',
    fontSize: '12px',
    textAlign: 'center' as const,
    lineHeight: 1.6,
};
