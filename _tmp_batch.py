#!/usr/bin/env python3
"""Batch wrap English text with TransText/zhMap across modal files."""
import re

# ======== AIProviderModal.tsx ========
with open('src/modules/agent-network/AIProviderModal.tsx', 'r') as f:
    content = f.read()

replacements = [
    # Callout warning
    ('No active proxy clusters are available. Connect at least one\n                  proxy under',
     '<TransText>No active proxy clusters are available. Connect at least one</TransText>\n                  proxy under'),
    ('before adding a provider.',
     '<TransText>before adding a provider.</TransText>'),

    # Form labels
    ('label={"Provider"}', 'label={<TransText>Provider</TransText>}'),
    ('helpText={"API provider to expose through NetBird."}', 
     'helpText={<TransText>API provider to expose through NetBird.</TransText>}'),

    # Upstream URL (plain variant)
    ('"Upstream URL"\n                  )\n                }\n                helpText',
     '<TransText>Upstream URL</TransText>\n                  )\n                }\n                helpText'),

    # Upstream URL (kimi variant)
    ('Upstream URL\n                      <HelpTooltip',
     '<TransText>Upstream URL</TransText>\n                      <HelpTooltip'),

    # Placeholders
    ('searchPlaceholder={"Search providers..."}', 
     'searchPlaceholder={zhMap["Search providers..."] || "Search providers..."}'),
    ('placeholder={"Select provider..."}', 
     'placeholder={zhMap["Select provider..."] || "Select provider..."}'),

    # Display name
    ('label={"Display name"}', 'label={<TransText>Display name</TransText>}'),
    ('placeholder={"e.g. OpenAI"}', 
     'placeholder={zhMap["e.g. OpenAI"] || "e.g. OpenAI"}'),

    # Buttons
    ('"Save Changes"', 'zhMap["Save Changes"] || "Save Changes"'),
    
    # Mappings tab
    ('Mappings\n              </TabsTrigger>',
     '<TransText>Mappings</TransText>\n              </TabsTrigger>'),

    # Model tab content  
    ('               Model Pricing\n', 
     '               <TransText>Model Pricing</TransText>\n'),
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
    else:
        print(f'WARN: not found: {old[:60]}...')

# Provider API key
content = content.replace(
    'placeholder={\n                        ? "sk-..."',
    'placeholder={\n                        ? zhMap["sk-..."] || "sk-..."')

# Cancel / Continue buttons
content = content.replace(
    '<ModalClose>\n                    Cancel\n                  </ModalClose>',
    '<ModalClose>\n                    <TransText>Cancel</TransText>\n                  </ModalClose>')
content = content.replace(
    '>Continue<',
    '><TransText>Continue</TransText><')

with open('src/modules/agent-network/AIProviderModal.tsx', 'w') as f:
    f.write(content)
print('AIProviderModal done')

# ======== AgentConnectModal.tsx ========
with open('src/modules/agent-network/AgentConnectModal.tsx', 'r') as f:
    content = f.read()

# Add imports
import_line = '\nimport { TransText } from "@/i18n/trans-text";\nimport zhMap from "@/i18n/zh-map";\n'
# Insert after last import
lines = content.split('\n')
last_import = 0
for i, line in enumerate(lines):
    if line.strip().startswith('import '):
        last_import = i
lines.insert(last_import + 1, import_line.strip())
content = '\n'.join(lines)

# Wrap texts
content = content.replace(
    'Configure Your Agent',
    '{zhMap["Configure Your Agent"] || "Configure Your Agent"}'
)

# The snippet caption
content = content.replace(
    'Run in your shell:',
    '{zhMap["Run in your shell:"] || "Run in your shell:"}'
)

with open('src/modules/agent-network/AgentConnectModal.tsx', 'w') as f:
    f.write(content)
print('AgentConnectModal done')

# ======== AgentPolicyModal.tsx ========
with open('src/modules/agent-network/AgentPolicyModal.tsx', 'r') as f:
    content = f.read()

# Add imports
lines = content.split('\n')
last_import = 0
for i, line in enumerate(lines):
    if line.strip().startswith('import '):
        last_import = i
lines.insert(last_import + 1, import_line.strip())
content = '\n'.join(lines)

# Wrap texts
content = content.replace(
    'Create Agent Policy',
    '{zhMap["Create Agent Policy"] || "Create Agent Policy"}'
)
content = content.replace(
    'Edit Agent Policy',
    '{zhMap["Edit Agent Policy"] || "Edit Agent Policy"}'
)
content = content.replace(
    'Create a policy to control access to Agent Network providers.',
    '{zhMap["Create a policy to control access to Agent Network providers."] || "Create a policy to control access to Agent Network providers."}'
)
content = content.replace(
    'Update this policy.',
    '{zhMap["Update this policy."] || "Update this policy."}'
)

with open('src/modules/agent-network/AgentPolicyModal.tsx', 'w') as f:
    f.write(content)
print('AgentPolicyModal done')

print('All done!')
