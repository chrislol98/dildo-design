'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
var _typeof = require('@babel/runtime/helpers/typeof');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;
var _extends2 = _interopRequireDefault(require('@babel/runtime/helpers/extends'));
var _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'));
var _react = _interopRequireWildcard(require('react'));
var _context = require('../context');
function _getRequireWildcardCache(e) {
  if ('function' != typeof WeakMap) return null;
  var r = new WeakMap(),
    t = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(e) {
    return e ? t : r;
  })(e);
}
function _interopRequireWildcard(e, r) {
  if (!r && e && e.__esModule) return e;
  if (null === e || ('object' != _typeof(e) && 'function' != typeof e)) return { default: e };
  var t = _getRequireWildcardCache(r);
  if (t && t.has(e)) return t.get(e);
  var n = { __proto__: null },
    a = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var u in e)
    if ('default' !== u && Object.prototype.hasOwnProperty.call(e, u)) {
      var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
      i && (i.get || i.set) ? Object.defineProperty(n, u, i) : (n[u] = e[u]);
    }
  return (n['default'] = e), t && t.set(e, n), n;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r &&
      (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })),
      t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2
      ? ownKeys(Object(t), !0).forEach(function (r) {
          (0, _defineProperty2['default'])(e, r, t[r]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
      : ownKeys(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
  }
  return e;
}
function alignCenterComponent(iconProps, ref) {
  var _useContext = (0, _react.useContext)(_context.IconContext),
    _useContext$prefixCls = _useContext.prefixCls,
    prefixCls = _useContext$prefixCls === void 0 ? 'arco' : _useContext$prefixCls;
  var spin = iconProps.spin,
    className = iconProps.className;
  var props = _objectSpread(
    _objectSpread(
      {
        'aria-hidden': true,
        focusable: false,
        ref: ref,
      },
      iconProps
    ),
    {},
    {
      className: ''
        .concat(className ? className + ' ' : '')
        .concat(prefixCls, '-icon ')
        .concat(prefixCls, '-icon-alignCenter'),
    }
  );
  if (spin) {
    props.className = ''.concat(props.className, ' ').concat(prefixCls, '-icon-loading');
  }
  delete props.spin;
  delete props.isIcon;
  return /*#__PURE__*/ _react['default'].createElement(
    'svg',
    (0, _extends2['default'])(
      {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '4',
        viewBox: '0 0 48 48',
      },
      props
    ),
    /*#__PURE__*/ _react['default'].createElement('path', {
      d: 'M44 9H4m38 20H6m28-10H14m20 20H14',
    })
  );
}
var alignCenter = /*#__PURE__*/ _react['default'].forwardRef(alignCenterComponent);
alignCenter.defaultProps = {
  isIcon: true,
};
alignCenter.displayName = 'alignCenter';
var _default = (exports['default'] = alignCenter);
