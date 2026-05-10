CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  nom TEXT,
  prenom TEXT,
  ville TEXT,
  code_postal TEXT,
  source TEXT NOT NULL,
  etape INTEGER,
  donnees_projet JSONB,
  consent_partners BOOLEAN NOT NULL DEFAULT FALSE,
  consent_date TIMESTAMPTZ,
  consent_revoked_at TIMESTAMPTZ,
  qualification TEXT DEFAULT 'brut',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, source)
);

CREATE TABLE dossiers (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  adresse TEXT,
  commune TEXT,
  code_postal TEXT,
  prix NUMERIC,
  surface NUMERIC,
  dpe_energie TEXT,
  dpe_ges TEXT,
  statut TEXT DEFAULT 'en_recherche',
  donnees JSONB NOT NULL,
  analyse_ia JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id UUID REFERENCES dossiers(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  nom TEXT NOT NULL,
  entreprise TEXT,
  email TEXT,
  telephone TEXT,
  ville TEXT,
  departement TEXT,
  code_postal TEXT,
  abonnement_actif BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lead_routage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  pro_id UUID REFERENCES pros(id) ON DELETE CASCADE,
  statut TEXT DEFAULT 'envoye',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_qualification ON leads(qualification);
CREATE INDEX idx_dossiers_email ON dossiers(email);
CREATE INDEX idx_dossiers_commune ON dossiers(commune);
CREATE INDEX idx_pros_type ON pros(type);
CREATE INDEX idx_pros_departement ON pros(departement);
CREATE INDEX idx_lead_routage_statut ON lead_routage(statut);
