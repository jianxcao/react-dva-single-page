function isClassComponent(component) {
  return (
    typeof component === 'function' && 
      !!component.prototype.isReactComponent
  ) ? true : false;
}

export function isReactComponent(component) {
  return (
    isClassComponent(component)
  ) ? true : false;
}

export function isElement(element) {
  return React.isValidElement(element);
}

export function isDOMTypeElement(element) {
  return isElement(element) && typeof element.type === 'string';
}

export function isCompositeTypeElement(element) {
  return isElement(element) && typeof element.type === 'function';
}
