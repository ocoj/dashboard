/**
 * Pattern rules for copy that is assembled at runtime, e.g.
 *   `Delete '${group.name}'?`  ->  "Delete '卡卡'?"  ->  删除「卡卡」？
 *
 * Exact lookup in `zh-map` cannot match these because the interpolated part
 * varies. Rules are applied in order, first match wins, and anything that
 * does not match is returned unchanged.
 */

type Rule = [RegExp, (m: RegExpMatchArray) => string];

const QUOTE = String.raw`['"“](.+?)['"”]`;

const RULES: Rule[] = [
  // ---------- 删除 / 移除 ----------
  [new RegExp(String.raw`^Delete network ${QUOTE}\?$`), (m) => `删除网络「${m[1]}」？`],
  [new RegExp(String.raw`^Delete resource ${QUOTE}\?$`), (m) => `删除资源「${m[1]}」？`],
  [new RegExp(String.raw`^Delete policy ${QUOTE}\?$`), (m) => `删除策略「${m[1]}」？`],
  [new RegExp(String.raw`^Delete record ${QUOTE}\?$`), (m) => `删除记录「${m[1]}」？`],
  [new RegExp(String.raw`^Delete zone ${QUOTE}\?$`), (m) => `删除区域「${m[1]}」？`],
  [new RegExp(String.raw`^Delete invite for ${QUOTE}\?$`), (m) => `删除「${m[1]}」的邀请？`],
  [new RegExp(String.raw`^Delete peer (.+) from ${QUOTE} network\?$`), (m) => `从网络「${m[2]}」中删除节点「${m[1]}」？`],
  [new RegExp(String.raw`^Delete ${QUOTE}\?$`), (m) => `删除「${m[1]}」？`],
  [new RegExp(String.raw`^Delete (\d+) (peers?|groups?|users?)$`), (m) => {
    const unit = m[2].startsWith("peer") ? "节点" : m[2].startsWith("group") ? "组" : "用户";
    return `删除 ${m[1]} 个${unit}`;
  }],
  [new RegExp(String.raw`^Remove (.+)\?$`), (m) => `移除 ${translateEntity(m[1])} ？`],
  [new RegExp(String.raw`^Delete (Group|Network|Route|Peers) (.+)$`), (m) => {
    const unit = { Group: "组", Network: "网络", Route: "路由", Peers: "节点" }[m[1]] ?? m[1];
    return `删除${unit} ${m[2]}`;
  }],
  [new RegExp(String.raw`^Remove (Peer|User) from Group (.+)$`), (m) =>
    `从组 ${m[2]} 中移除${{ Peer: "节点", User: "用户" }[m[1]] ?? m[1]}`],
  [new RegExp(String.raw`^Add (.+) (account|customer)$`), (m) =>
    `添加 ${m[1]} ${m[2] === "account" ? "账户" : "客户"}`],
  [new RegExp(String.raw`^Download Invoice \((CSV|PDF)\)$`), (m) => `下载发票（${m[1]}）`],
  [new RegExp(String.raw`^Downloading (.+)\.csv\.\.\.$`), (m) => `正在下载 ${m[1]}.csv...`],
  [new RegExp(String.raw`^JWT allow group - (.+)$`), (m) => `JWT 允许组 - ${m[1]}`],
  [new RegExp(String.raw`^Only users part of the (.+) group will be able to access NetBird\. Are you sure you want to continue\?$`),
    (m) => `只有属于 ${m[1]} 组的用户才能访问 NetBird。确定要继续吗？`],
  // ---------- 审批 / 封禁 / 合规 ----------
  [new RegExp(String.raw`^Approve peer ${QUOTE}\?$`), (m) => `批准节点「${m[1]}」？`],
  [new RegExp(String.raw`^Block ${QUOTE}\?$`), (m) => `封禁「${m[1]}」？`],
  [new RegExp(String.raw`^Reject ${QUOTE}\?$`), (m) => `拒绝「${m[1]}」？`],
  [new RegExp(String.raw`^Bypass compliance for ${QUOTE}\?$`), (m) => `为节点「${m[1]}」绕过合规检查？`],
  [new RegExp(String.raw`^Bypass compliance for (\d+) peers?\?$`), (m) => `为 ${m[1]} 个节点绕过合规检查？`],
  [new RegExp(String.raw`^Overwrite existing groups\?$`), () => "覆盖现有组？"],
  [new RegExp(String.raw`^Create a Setup Key\?$`), () => "创建安装密钥？"],
  [new RegExp(String.raw`^Regenerate Auth Token\?$`), () => "重新生成认证令牌？"],
  // ---------- 启用 / 禁用 / 断开 ----------
  [new RegExp(String.raw`^(?:Enable|Disable) (.+)\?$`), (m, ) => `${m[0].startsWith("Enable") ? "启用" : "禁用"} ${translateEntity(m[1])} ？`],
  [new RegExp(String.raw`^Disconnect (.+)\?$`), (m) => `断开 ${translateEntity(m[1])} ？`],
  // ---------- 组 / 资源 / 网络相关 ----------
  [new RegExp(String.raw`^Add Resource to ${QUOTE}\?$`), (m) => `向「${m[1]}」添加资源？`],
  [new RegExp(String.raw`^Add Routing Peer to ${QUOTE}\?$`), (m) => `向「${m[1]}」添加路由节点？`],
  [new RegExp(String.raw`^Add new record to ${QUOTE}\?$`), (m) => `向「${m[1]}」添加新记录？`],
  [new RegExp(String.raw`^Add Users? to Group (.+)$`), (m) => `将用户添加到组 ${m[1]}`],
  [new RegExp(String.raw`^Remove Users? from Group (.+)$`), (m) => `从组 ${m[1]} 中移除用户`],
  [new RegExp(String.raw`^Rename Group (.+)$`), (m) => `重命名组 ${m[1]}`],
  [new RegExp(String.raw`^Rename group ${QUOTE}\?$`), (m) => `重命名组「${m[1]}」？`],
  [new RegExp(String.raw`^Edit resource ${QUOTE}\?$`), (m) => `编辑资源「${m[1]}」？`],
  [new RegExp(String.raw`^Do you want to create a new access control policy for the route ${QUOTE}\?$`),
    (m) => `是否为路由「${m[1]}」创建新的访问控制策略？`],
  // ---------- 进行中 ----------
  [new RegExp(String.raw`^Deleting (.+?)(?:\.\.\.)?$`), (m) => `正在删除 ${m[1]}...`],
  [new RegExp(String.raw`^(Creating|Regenerating) (?:invite link|user account) for (.+)\.\.\.$`),
    (m) => `正在为 ${m[2]} ${m[1] === "Creating" ? "创建" : "重新生成"}...`],
  [new RegExp(String.raw`^Removing (.+)\.\.\.$`), (m) => `正在移除 ${m[1]}...`],
  [new RegExp(String.raw`^(Enabling|Disabling) (.+?)(?:\.\.\.)?$`),
    (m) => `正在${m[1] === "Enabling" ? "启用" : "禁用"} ${translateEntity(m[2])}...`],
  [new RegExp(String.raw`^Granting access to (.+?)\??$`), (m) => `正在授予 ${m[1]} 访问权限`],
  [new RegExp(String.raw`^Adding (.+)\.\.\.$`), (m) => `正在添加 ${m[1]}...`],
  // ---------- 完成 / 结果 ----------
  [new RegExp(String.raw`^(.+) Integration was successfully (deleted|updated)$`),
    (m) => `${m[1]} 集成已成功${m[2] === "deleted" ? "删除" : "更新"}`],
  [new RegExp(String.raw`^(.+) Integration$`), (m) => `${m[1]} 集成`],
  [new RegExp(String.raw`^(.+) was successfully connected to NetBird\.$`), (m) => `${m[1]} 已成功连接到 NetBird。`],
  [new RegExp(String.raw`^(.+) was successfully (saved|created|updated|deleted|synced|set up|regenerated|disconnected)\.?$`),
    (m) => `${m[1]} 已成功${successVerb(m[2])}`],
  [new RegExp(String.raw`^(.+) was successfully (enabled|disabled)\.?$`),
    (m) => `${m[1]} 已成功${m[2] === "enabled" ? "启用" : "禁用"}`],
  [new RegExp(String.raw`^(.+) was successfully (deleted|updated) successfully\.$`), (m) => `${m[1]} 已成功更新`],
  [new RegExp(String.raw`^(.+) was successfully added to (.+)\.$`), (m) => `${m[1]} 已成功添加到 ${m[2]}。`],
  [new RegExp(String.raw`^(.+) has been successfully (removed|added)$`), (m) =>
    `${m[1]} 已成功${m[2] === "removed" ? "移除" : "添加"}`],
  [new RegExp(String.raw`^(.+) has been (removed|added)$`), (m) =>
    `${m[1]} 已${m[2] === "removed" ? "移除" : "添加"}`],
  [new RegExp(String.raw`^(.+) is now (enabled|disabled|active)\.?$`), (m) =>
    `${m[1]} 现已${m[2] === "enabled" ? "启用" : m[2] === "disabled" ? "禁用" : "激活"}`],
  [new RegExp(String.raw`^(.+) was (added|deleted|updated|created) successfully\.$`), (m) =>
    `${m[1]} 已成功${{ added: "添加", deleted: "删除", updated: "更新", created: "创建" }[m[2]]}。`],
  [new RegExp(String.raw`^(.+) can now be attached to policies\.$`), (m) => `${m[1]} 现在可以附加到策略。`],
  [new RegExp(String.raw`^(.+) is now available on your agent network endpoint\.$`),
    (m) => `${m[1]} 现在可在您的 Agent Network 端点上使用。`],
  [new RegExp(String.raw`^(.+) is now subject to normal compliance validation\.$`),
    (m) => `${m[1]} 现已接受常规合规校验。`],
  [new RegExp(String.raw`^Groups of (.+) were successfully saved\.$`), (m) => `${m[1]} 的组已成功保存。`],
  [new RegExp(String.raw`^Group ${QUOTE} successfully created$`), (m) => `组「${m[1]}」已成功创建`],
  [new RegExp(String.raw`^Peer (.+) approved$`), (m) => `节点 ${m[1]} 已批准`],
  [new RegExp(String.raw`^Compliance bypassed for (.+)$`), (m) => `已为 ${m[1]} 绕过合规检查`],
  [new RegExp(String.raw`^Posture Check (.+)$`), (m) => `态势检查 ${m[1]}`],
  [new RegExp(String.raw`^(.+) Record (.+)$`), (m) => `${m[1]} 记录 ${m[2]}`],
  [new RegExp(String.raw`^(Enabling|Disabling|Updating|Creating) (.+)$`),
    (m) => `正在${m[1] === "Enabling" ? "启用" : m[1] === "Disabling" ? "禁用" : m[1] === "Updating" ? "更新" : "创建"} ${m[2]}`],
];

/** 句中实体（动态名称前后常见的英文短语） */
const ENTITY: Record<string, string> = {
  "this router": "此路由器",
  "this domain": "此域名",
  "this check": "此检查",
  "this group": "此组",
  "this peer": "此节点",
  "the peer": "此节点",
  "SSH Access": "SSH 访问",
  "reverse proxy": "反向代理",
  "Generic HTTP Integration": "通用 HTTP 集成",
  Domain: "域名",
  domain: "域名",
};

function translateEntity(text: string): string {
  const t = text.trim();
  if (ENTITY[t]) return ENTITY[t];
  const integration = t.match(/^the (.+) integration$/i);
  if (integration) return `${integration[1]} 集成`;
  return t;
}

function successVerb(verb: string): string {
  switch (verb) {
    case "saved":
      return "保存";
    case "created":
      return "创建";
    case "updated":
      return "更新";
    case "deleted":
      return "删除";
    case "synced":
      return "同步";
    case "set up":
      return "完成设置";
    case "regenerated":
      return "重新生成";
    case "disconnected":
      return "断开连接";
    default:
      return verb;
  }
}

/** Returns a Chinese rendering when a rule matches, otherwise `undefined`. */
export function localizeByPattern(text: string): string | undefined {
  for (const [re, render] of RULES) {
    const m = text.match(re);
    if (m) return render(m);
  }
  return undefined;
}
