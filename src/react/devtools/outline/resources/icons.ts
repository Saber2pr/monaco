import { SymbolInformation } from '../SymbolNode'

enum SymbolKind {
  unknown = '',
  warning = 'warning',
  /** predefined type (void) or keyword (class) */
  keyword = 'keyword',
  /** top level script node */
  scriptElement = 'script',
  /** module foo {} */
  moduleElement = 'module',
  /** class X {} */
  classElement = 'class',
  /** var x = class X {} */
  localClassElement = 'local class',
  /** interface Y {} */
  interfaceElement = 'interface',
  /** type T = ... */
  typeElement = 'type',
  /** enum E */
  enumElement = 'enum',
  enumMemberElement = 'enum member',
  /**
   * Inside module and script only
   * const v = ..
   */
  variableElement = 'var',
  /** Inside function */
  localVariableElement = 'local var',
  /**
   * Inside module and script only
   * function f() { }
   */
  functionElement = 'function',
  /** Inside function */
  localFunctionElement = 'local function',
  /** class X { [public|private]* foo() {} } */
  memberFunctionElement = 'method',
  /** class X { [public|private]* [get|set] foo:number; } */
  memberGetAccessorElement = 'getter',
  memberSetAccessorElement = 'setter',
  /**
   * class X { [public|private]* foo:number; }
   * interface Y { foo:number; }
   */
  memberVariableElement = 'property',
  /**
   * class X { constructor() { } }
   * class X { static { } }
   */
  constructorImplementationElement = 'constructor',
  /** interface Y { ():number; } */
  callSignatureElement = 'call',
  /** interface Y { []:number; } */
  indexSignatureElement = 'index',
  /** interface Y { new():Y; } */
  constructSignatureElement = 'construct',
  /** function foo(*Y*: string) */
  parameterElement = 'parameter',
  typeParameterElement = 'type parameter',
  primitiveType = 'primitive type',
  label = 'label',
  alias = 'alias',
  constElement = 'const',
  letElement = 'let',
  directory = 'directory',
  externalModuleName = 'external module name',
  /**
   * <JsxTagName attribute1 attribute2={0} />
   */
  jsxAttribute = 'JSX attribute',
  /** String literal */
  string = 'string',
  /** Jsdoc @link: in `{@link C link text}`, the before and after text "{@link " and "}" */
  link = 'link',
  /** Jsdoc @link: in `{@link C link text}`, the entity name "C" */
  linkName = 'link name',
  /** Jsdoc @link: in `{@link C link text}`, the link text "link text" */
  linkText = 'link text',
}

export const getIcon = (
  kind: SymbolInformation['kind'],
): { dark: string; light: string } => {
  let icon: string
  switch (kind as any) {
    case SymbolKind.classElement:
    case SymbolKind.localClassElement:
      icon = 'class'
      break
    case SymbolKind.constElement:
      icon = 'constant'
      break
    case SymbolKind.constructorImplementationElement:
    case SymbolKind.functionElement:
    case SymbolKind.localFunctionElement:
    case SymbolKind.memberFunctionElement:
      icon = 'function'
      break
    case SymbolKind.interfaceElement:
    case SymbolKind.indexSignatureElement:
    case SymbolKind.callSignatureElement:
      icon = 'interface'
    case SymbolKind.moduleElement:
    case SymbolKind.externalModuleName:
      icon = 'module'
      break
    case SymbolKind.memberVariableElement:
      icon = 'property'
      break
    default:
      icon = 'variable'
      break
  }
  icon = `icon-${icon}.svg`
  return {
    dark: require(`./dark/${icon}`),
    light: require(`./light/${icon}`),
  }
}
