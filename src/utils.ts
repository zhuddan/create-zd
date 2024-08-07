export function capitalizeFirstLetter(string = '') {
  if (!string)
    return '' // 如果字符串为空，则返回空字符串
  return string.charAt(0).toUpperCase() + string.slice(1)
}
