#!/usr/bin/env python3
import sys

files_to_process = [
    'src/modules/agent-network/AIProviderModal.tsx',
    'src/modules/agent-network/AgentConnectModal.tsx',
    'src/modules/agent-network/AgentPolicyModal.tsx',
]

for filepath in files_to_process:
    with open(filepath, 'r') as f:
        content = f.read()

    # Add imports after last import
    import_line = 'import { TransText } from "@/i18n/trans-text";\nimport zhMap from "@/i18n/zh-map";'
    # Find last import statement index
    lines = content.split('\n')
    last_import_idx = 0
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('import ') or stripped.startswith('} from'):
            last_import_idx = i
    lines.insert(last_import_idx + 1, import_line)
    content = '\n'.join(lines)

    with open(filepath, 'w') as f:
        f.write(content)
    print(f'Added imports to {filepath}')

print('Done adding imports')
