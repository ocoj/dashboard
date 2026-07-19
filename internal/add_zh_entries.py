#!/usr/bin/env python3
"""Add missing zh-map entries in sorted order."""
import re

# Read the current zh-map
with open('src/i18n/zh-map.ts', 'r') as f:
    content = f.read()

# New entries to add (English, Chinese)
new_entries = [
    ('Access to the dashboard will be limited and regular users will not be able to view any peers.', '仪表板访问将受限，普通用户将无法查看任何节点。'),
    ('Add a setup key to register new machines in your network. The key links machines to your account during initial setup.', '添加安装密钥以在网络中注册新设备。密钥在初始设置时将设备关联到您的账户。'),
    ('Add New Users', '添加新用户'),
    ('Add User', '添加用户'),
    ("Allow group propagation from user's auto-groups to peers, sharing membership information.", '允许从用户的自动组向节点传播组，共享成员资格信息。'),
    ('Assign this group when creating a new setup key to see them listed here.', '创建新安装密钥时分配此组，即可在此处查看。'),
    ('Configure identity providers for user authentication in your network.', '为网络中的用户认证配置身份提供者。'),
    ('Create Setup Key', '创建安装密钥'),
    ('Enable Routing Peer DNS Resolution', '启用路由节点 DNS 解析'),
    ("Extract & sync groups from JWT claims with user's auto-groups, auto-creating groups from tokens.", '从 JWT claims 中提取并同步组到用户的自动组，自动从令牌创建组。'),
    ('Invite User', '邀请用户'),
    ("It looks like you don't have any users yet. Get started by inviting users to your account.", '您还没有任何用户。开始邀请用户加入您的账户。'),
    ('Limit access to NetBird for the specified group names, e.g., NetBird users. To use the groups, you need to configure them first in your IdP.', '限制指定组名（如 NetBird 用户）对 NetBird 的访问。使用这些组之前，需要先在 IdP 中配置。'),
    ('Local authentication is disabled. Use your IdP for authentication.', '本地认证已禁用。请使用您的 IdP 进行认证。'),
    ('Peers in the selected groups will receive IPv6 overlay addresses (dual-stack). Remove all groups to disable IPv6. Changes apply on save and will restart affected clients.', '所选组中的节点将获得 IPv6 覆盖地址（双栈）。移除所有组可禁用 IPv6。保存后更改生效并将重启受影响的客户端。'),
    ('Resolves DNS for routed domains on the routing peer instead of on the client. Requires NetBird client v0.35 or higher. Changes will only take effect after restarting the clients.', '在路由节点而非客户端上解析路由域名的 DNS。需要 NetBird 客户端 v0.35 或更高版本。更改仅在重启客户端后生效。'),
    ('Search by name, email or role...', '按名称、邮箱或角色搜索...'),
    ('Service user was successfully created.', '服务用户已成功创建。'),
    ('Service user was successfully deleted.', '服务用户已成功删除。'),
    ('Setup keys are pre-authentication keys that allow to register new machines in your network.', '安装密钥是预认证密钥，用于在网络中注册新设备。'),
    ('Show Invites', '显示邀请'),
    ('Specify a custom IPv4 range for your network in CIDR format. All peer IPs will be re-allocated when changed.', '以 CIDR 格式为网络指定自定义 IPv4 范围。更改后所有节点 IP 将重新分配。'),
    ('Specify a custom IPv6 range for your network in CIDR format. All peer IPv6 addresses will be re-allocated when changed.', '以 CIDR 格式为网络指定自定义 IPv6 范围。更改后所有节点 IPv6 地址将重新分配。'),
    ('Specify a custom peer DNS domain for your network. This should not point to a valid domain to avoid overriding DNS results.', '为网络指定自定义节点 DNS 域名。该域名不应指向有效域名，以避免覆盖 DNS 结果。'),
    ('User Groups', '用户组'),
]

# Format new entries as TS map lines, sorted by key
new_lines = []
for en, zh in sorted(new_entries, key=lambda x: x[0].lower()):
    esc = en.replace("'", "\\'")
    new_lines.append(f"  '{esc}': '{zh}',")

# Find insertion point (last entry line before closing brace)
lines = content.split('\n')
last_entry = None
for i in range(len(lines) - 1, -1, -1):
    stripped = lines[i].strip()
    if stripped.startswith("'"):
        last_entry = i
        break

if last_entry is None:
    print("ERROR: Could not find insertion point")
    exit(1)

new_content = '\n'.join(lines[:last_entry + 1] + new_lines + lines[last_entry + 1:])

with open('src/i18n/zh-map.ts', 'w') as f:
    f.write(new_content)

print(f'Added {len(new_lines)} entries to zh-map.ts')

# Verify no duplicates
with open('src/i18n/zh-map.ts', 'r') as f:
    content2 = f.read()
matches = re.findall(r"'([^']+)':", content2)
from collections import Counter
dups = [k for k, v in Counter(matches).items() if v > 1]
if dups:
    print(f'WARNING: Duplicate keys: {dups}')
else:
    print('No duplicate keys found')
