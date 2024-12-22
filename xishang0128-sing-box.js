const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['🐸 手动切换'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }  
  if (['🐠 漏网之鱼'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /漏网之鱼/i))
  }  
  if (['🎯 全球直连'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /全球直连/i))
  }
  if (['dns-out'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /dns-out/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
