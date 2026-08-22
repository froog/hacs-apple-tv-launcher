//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, ee = h.trustedTypes, te = ee ? ee.emptyScript : "", ne = h.reactiveElementPolyfillSupport, g = (e, t) => e, re = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? te : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, ie = (e, t) => !l(e, t), ae = {
	attribute: !0,
	type: String,
	converter: re,
	reflect: !1,
	useDefault: !1,
	hasChanged: ie
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var _ = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ae) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? ae;
	}
	static _$Ei() {
		if (this.hasOwnProperty(g("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(g("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? re : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? re : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ie)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
_.elementStyles = [], _.shadowRootOptions = { mode: "open" }, _[g("elementProperties")] = /* @__PURE__ */ new Map(), _[g("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: _ }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var v = globalThis, oe = (e) => e, y = v.trustedTypes, se = y ? y.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, b = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, S = "?" + x, ce = `<${S}>`, C = document, w = () => C.createComment(""), T = (e) => e === null || typeof e != "object" && typeof e != "function", E = Array.isArray, le = (e) => E(e) || typeof e?.[Symbol.iterator] == "function", D = "[ 	\n\f\r]", O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ue = /-->/g, de = />/g, k = RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), fe = /'/g, pe = /"/g, me = /^(?:script|style|textarea|title)$/i, A = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), j = Symbol.for("lit-noChange"), M = Symbol.for("lit-nothing"), he = /* @__PURE__ */ new WeakMap(), N = C.createTreeWalker(C, 129);
function ge(e, t) {
	if (!E(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return se === void 0 ? t : se.createHTML(t);
}
var _e = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = O;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === O ? c[1] === "!--" ? o = ue : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = k) : (me.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = k) : o = de : o === k ? c[0] === ">" ? (o = i ?? O, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? k : c[3] === "\"" ? pe : fe) : o === pe || o === fe ? o = k : o === ue || o === de ? o = O : (o = k, i = void 0);
		let d = o === k && e[t + 1].startsWith("/>") ? " " : "";
		a += o === O ? n + ce : l >= 0 ? (r.push(s), n.slice(0, l) + b + n.slice(l) + x + d) : n + x + (l === -2 ? t : d);
	}
	return [ge(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, P = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = _e(t, n);
		if (this.el = e.createElement(l, r), N.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = N.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(b)) {
					let t = u[o++], n = i.getAttribute(e).split(x), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ye : r[1] === "?" ? be : r[1] === "@" ? xe : L
					}), i.removeAttribute(e);
				} else e.startsWith(x) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (me.test(i.tagName)) {
					let e = i.textContent.split(x), t = e.length - 1;
					if (t > 0) {
						i.textContent = y ? y.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], w()), N.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], w());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === S) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(x, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += x.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = C.createElement("template");
		return n.innerHTML = e, n;
	}
};
function F(e, t, n = e, r) {
	if (t === j) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = T(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = F(e, i._$AS(e, t.values), i, r)), t;
}
var ve = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? C).importNode(t, !0);
		N.currentNode = r;
		let i = N.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new I(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Se(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = N.nextNode(), a++);
		}
		return N.currentNode = C, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, I = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = M, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = F(this, e, t), T(e) ? e === M || e == null || e === "" ? (this._$AH !== M && this._$AR(), this._$AH = M) : e !== this._$AH && e !== j && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? le(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== M && T(this._$AH) ? this._$AA.nextSibling.data = e : this.T(C.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = P.createElement(ge(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ve(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = he.get(e.strings);
		return t === void 0 && he.set(e.strings, t = new P(e)), t;
	}
	k(t) {
		E(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(w()), this.O(w()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = oe(e).nextSibling;
			oe(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, L = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = M, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = M;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = F(this, e, t, 0), a = !T(e) || e !== this._$AH && e !== j, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = F(this, r[n + o], t, o), s === j && (s = this._$AH[o]), a ||= !T(s) || s !== this._$AH[o], s === M ? e = M : e !== M && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === M ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ye = class extends L {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === M ? void 0 : e;
	}
}, be = class extends L {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== M);
	}
}, xe = class extends L {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = F(this, e, t, 0) ?? M) === j) return;
		let n = this._$AH, r = e === M && n !== M || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== M && (n === M || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Se = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		F(this, e);
	}
}, Ce = {
	M: b,
	P: x,
	A: S,
	C: 1,
	L: _e,
	R: ve,
	D: le,
	V: F,
	I,
	H: L,
	N: be,
	U: xe,
	B: ye,
	F: Se
}, we = v.litHtmlPolyfillSupport;
we?.(P, I), (v.litHtmlVersions ??= []).push("3.3.3");
var Te = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new I(t.insertBefore(w(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, R = globalThis, z = class extends _ {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Te(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return j;
	}
};
z._$litElement$ = !0, z.finalized = !0, R.litElementHydrateSupport?.({ LitElement: z });
var Ee = R.litElementPolyfillSupport;
Ee?.({ LitElement: z }), (R.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/lit-html/directive.js
var B = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, V = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), H = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
}, U = V(class extends H {
	constructor(e) {
		if (super(e), e.type !== B.ATTRIBUTE || e.name !== "class" || e.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
	}
	render(e) {
		return " " + Object.keys(e).filter((t) => e[t]).join(" ") + " ";
	}
	update(e, [t]) {
		if (this.st === void 0) {
			this.st = /* @__PURE__ */ new Set(), e.strings !== void 0 && (this.nt = new Set(e.strings.join(" ").split(/\s/).filter((e) => e !== "")));
			for (let e in t) t[e] && !this.nt?.has(e) && this.st.add(e);
			return this.render(t);
		}
		let n = e.element.classList;
		for (let e of this.st) e in t || (n.remove(e), this.st.delete(e));
		for (let e in t) {
			let r = !!t[e];
			r === this.st.has(e) || this.nt?.has(e) || (r ? (n.add(e), this.st.add(e)) : (n.remove(e), this.st.delete(e)));
		}
		return j;
	}
}), { I: De } = Ce, Oe = (e) => e, ke = () => document.createComment(""), W = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new De(r.insertBefore(ke(), i), r.insertBefore(ke(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = Oe(e).nextSibling;
				Oe(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, G = (e, t, n = e) => (e._$AI(t, n), e), Ae = {}, je = (e, t = Ae) => e._$AH = t, Me = (e) => e._$AH, K = (e) => {
	e._$AR(), e._$AA.remove();
}, Ne = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, Pe = V(class extends H {
	constructor(e) {
		if (super(e), e.type !== B.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, t, n) {
		let r;
		n === void 0 ? n = t : t !== void 0 && (r = t);
		let i = [], a = [], o = 0;
		for (let t of e) i[o] = r ? r(t, o) : o, a[o] = n(t, o), o++;
		return {
			values: a,
			keys: i
		};
	}
	render(e, t, n) {
		return this.dt(e, t, n).values;
	}
	update(e, [t, n, r]) {
		let i = Me(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = G(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = G(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = G(i[d], a[m]), W(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = G(i[f], a[p]), W(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = Ne(o, p, m), u = Ne(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = W(e, i[d]);
					G(t, a[p]), c[p] = t;
				} else c[p] = G(n, a[p]), W(e, i[d], n), i[t] = null;
				p++;
			} else K(i[f]), f--;
		} else K(i[d]), d++;
		for (; p <= m;) {
			let t = W(e, c[m + 1]);
			G(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && K(e);
		}
		return this.ut = o, je(e, c), j;
	}
}), Fe = "important", Ie = " !" + Fe, q = V(class extends H {
	constructor(e) {
		if (super(e), e.type !== B.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
	}
	render(e) {
		return Object.keys(e).reduce((t, n) => {
			let r = e[n];
			return r == null ? t : t + `${n = n.includes("-") ? n : n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
		}, "");
	}
	update(e, [t]) {
		let { style: n } = e.element;
		if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
		for (let e of this.ft) t[e] ?? (this.ft.delete(e), e.includes("-") ? n.removeProperty(e) : n[e] = null);
		for (let e in t) {
			let r = t[e];
			if (r != null) {
				this.ft.add(e);
				let t = typeof r == "string" && r.endsWith(Ie);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? Fe : "") : n[e] = r;
			}
		}
		return j;
	}
}), Le = [
	[/netflix/i, ["#f7f5f0", "#d81f26"]],
	[/bbc|iplayer/i, ["#3f185f", "#ffffff"]],
	[/channel 4/i, ["#b8ff45", "#111111"]],
	[/itvx/i, ["#ffe500", "#17248b"]],
	[/tvnz/i, ["#1910a5", "#ffffff"]],
	[/three|3now/i, ["#ef1738", "#ffffff"]],
	[/prime/i, ["#0879df", "#ffffff"]],
	[/disney/i, ["#082765", "#ffffff"]],
	[/infuse/i, ["#6439df", "#ffffff"]],
	[/purevpn/i, ["#6842e8", "#ffffff"]],
	[/tubi/i, ["#6f48f5", "#ffffff"]],
	[/channel 5/i, ["#224784", "#ffd92f"]],
	[/music|sing/i, ["#f21d55", "#ffffff"]],
	[/photos/i, ["#f5f5f2", "#313238"]],
	[/settings/i, ["#a4a8a9", "#ffffff"]]
], Re = {
	"com.apple.TVWatchList": { trackId: 1174078549 },
	"com.apple.TVMusic": { trackId: 1108187390 },
	"com.apple.TVPhotos": { trackId: 1584215428 },
	"com.apple.Arcade": { url: "https://developer.apple.com/assets/elements/icons/arcade/arcade-128x128_2x.png" },
	"com.apple.TVAppStore": { url: "https://developer.apple.com/assets/elements/icons/app-store/app-store-128x128_2x.png" },
	"com.apple.TVSearch": {
		url: "https://help.apple.com/assets/6A440A7A736300C05C08253A/6A440A87867E8694C70A98B2/en_US/08f09cdac4972f4b3daf8d8912eea958.png",
		unframed: !1
	},
	"com.apple.TVSettings": {
		url: "https://help.apple.com/assets/6A440A7A736300C05C08253A/6A440A87867E8694C70A98B2/en_US/53286707fd1ad5fb25d30e83bc67b76d.png",
		unframed: !1
	},
	"com.apple.Sing": {
		url: "https://help.apple.com/assets/6A440A7A736300C05C08253A/6A440A87867E8694C70A98B2/en_US/e6bf83bb2c9562d02282b6dc567356c6.png",
		unframed: !1
	},
	"com.apple.TVHomeSharing": {
		url: "https://help.apple.com/assets/6A440A7A736300C05C08253A/6A440A87867E8694C70A98B2/en_US/7408de6d13cf09241848fed559d8b9aa.png",
		unframed: !1
	}
}, J = /* @__PURE__ */ new Map();
function ze(e) {
	let t = Le.find(([t]) => t.test(e));
	if (t) return t[1];
	let n = 0;
	for (let t of e) n = (n << 5) - n + t.charCodeAt(0) | 0;
	return [`hsl(${Math.abs(n) % 360} 54% 39%)`, "#ffffff"];
}
function Y(e, t) {
	return `https://toolbox.marketingtools.apple.com/api/download-artwork?${new URLSearchParams({
		id: String(e),
		type: "app",
		sf: t,
		lang: "en-us",
		lob: "apps",
		fileName: "icon.png",
		includeHairline: "false"
	})}`;
}
async function X(e, t, n) {
	try {
		let r = await e.callWS({
			type: "apple_tv_launcher/cache_artwork",
			track_id: t,
			country: n
		});
		return typeof r?.url == "string" ? r.url : null;
	} catch {
		return null;
	}
}
function Be(e, t) {
	let n = e.startsWith("uk.") || e.startsWith("com.itv.") ? "gb" : e.startsWith("nz.") ? "nz" : t;
	return [.../* @__PURE__ */ new Set([
		n,
		t,
		"us",
		"gb"
	])];
}
function Ve(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.primary == "string" && (t.fallback === null || typeof t.fallback == "string") && typeof t.unframed == "boolean" && (t.trackId === void 0 || Number.isInteger(t.trackId));
}
async function He(e, t, n) {
	let r = `${e}|${t}`;
	if (J.has(r)) return J.get(r) ?? null;
	let i = `apple-tv-launcher-artwork-v4:${r}`;
	try {
		let e = window.localStorage.getItem(i);
		if (e === "-") return J.set(r, null), null;
		if (e) {
			let i = JSON.parse(e);
			if (Ve(i)) return i.trackId && (i.primary = await X(n, i.trackId, t) ?? Y(i.trackId, t)), J.set(r, i), i;
		}
	} catch {}
	let a = null, o = new AbortController(), s = window.setTimeout(() => o.abort(), 1e4);
	try {
		let r = new URLSearchParams({
			bundleId: e,
			country: t
		}), i = await fetch(`https://itunes.apple.com/lookup?${r}`, { signal: o.signal });
		if (i.ok) {
			let e = (await i.json()).results?.[0], r = e?.artworkUrl512 ?? e?.artworkUrl100 ?? null;
			e?.trackId ? a = {
				primary: await X(n, e.trackId, t) ?? Y(e.trackId, t),
				fallback: r,
				unframed: !0,
				trackId: e.trackId
			} : r && (a = {
				primary: r,
				fallback: null,
				unframed: !1
			});
		}
	} catch {
		a = null;
	} finally {
		window.clearTimeout(s);
	}
	J.set(r, a);
	try {
		window.localStorage.setItem(i, a ? JSON.stringify(a) : "-");
	} catch {}
	return a;
}
async function Ue(e, t, n) {
	let r = e.id && t.artwork[e.id] || t.artwork[e.name];
	if (r) return {
		...e,
		artwork: r,
		artworkFallback: null,
		artworkFit: "cover",
		unframedArtwork: !1
	};
	if (!t.artwork_lookup) return e;
	let i = e.id ? Re[e.id] : void 0;
	if (i) {
		let r = i.trackId ? Y(i.trackId, t.artwork_country) : i.url ?? null, a = i.trackId ? await X(n, i.trackId, t.artwork_country) : null;
		return {
			...e,
			artwork: a ?? r,
			artworkFallback: null,
			artworkFit: i.fit ?? "cover",
			unframedArtwork: i.unframed !== !1
		};
	}
	if (!e.id) return e;
	for (let r of Be(e.id, t.artwork_country)) {
		let t = await He(e.id, r, n);
		if (t) return {
			...e,
			artwork: t.primary,
			artworkFallback: t.fallback,
			artworkFit: "cover",
			unframedArtwork: t.unframed
		};
	}
	return e;
}
//#endregion
//#region src/config.ts
var Z = Object.freeze({
	columns: 5,
	mobile_columns: 3,
	show_labels: !0,
	artwork_lookup: !0,
	artwork_country: "us",
	wake_before_launch: !0,
	wake_delay: 2500,
	retry: !0,
	app_order: [],
	include: [],
	exclude: [],
	artwork: {}
});
function We(e, t, n, r) {
	let i = Number(e);
	return Number.isFinite(i) ? Math.min(n, Math.max(t, Math.round(i))) : r;
}
function Ge(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function Q(e, t) {
	return typeof e == "boolean" ? e : t;
}
function Ke(e) {
	if (!e?.entity || !String(e.entity).startsWith("media_player.")) throw Error("Apple TV Launcher requires a media_player entity");
	let t = String(e.artwork_country ?? Z.artwork_country).trim().toLowerCase();
	return {
		entity: String(e.entity),
		...e.title === void 0 ? {} : { title: String(e.title) },
		columns: We(e.columns, 2, 10, Z.columns),
		mobile_columns: We(e.mobile_columns, 2, 6, Z.mobile_columns),
		show_labels: Q(e.show_labels, Z.show_labels),
		artwork_lookup: Q(e.artwork_lookup, Z.artwork_lookup),
		artwork_country: /^[a-z]{2}$/.test(t) ? t : Z.artwork_country,
		wake_before_launch: Q(e.wake_before_launch, Z.wake_before_launch),
		wake_delay: We(e.wake_delay, 0, 15e3, Z.wake_delay),
		retry: Q(e.retry, Z.retry),
		app_order: Ge(e.app_order),
		include: Ge(e.include),
		exclude: Ge(e.exclude),
		artwork: e.artwork && typeof e.artwork == "object" && !Array.isArray(e.artwork) ? Object.fromEntries(Object.entries(e.artwork).map(([e, t]) => [e, String(t)])) : {}
	};
}
function qe(e, t) {
	let n = new Set(t.map((e) => e.toLocaleLowerCase()));
	return n.has(e.name.toLocaleLowerCase()) || !!(e.id && n.has(e.id.toLocaleLowerCase()));
}
function Je(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.filter((e) => {
		let t = `${e.name.toLocaleLowerCase()}|${e.id?.toLocaleLowerCase() ?? ""}`;
		return !n.has(t) && (n.add(t), !0);
	}), i = (t.include.length ? r.filter((e) => qe(e, t.include)) : r).filter((e) => !qe(e, t.exclude)), a = new Map(t.app_order.map((e, t) => [e.toLocaleLowerCase(), t])), o = (e) => a.get(e.name.toLocaleLowerCase()) ?? (e.id ? a.get(e.id.toLocaleLowerCase()) : void 0) ?? 2 ** 53 - 1;
	return i.sort((e, t) => o(e) - o(t) || e.name.localeCompare(t.name));
}
function Ye(e) {
	return !!(e && ![
		"off",
		"unavailable",
		"unknown"
	].includes(e.state));
}
function Xe(e) {
	let t = e.split(/\s+/).filter(Boolean);
	return t.length === 1 ? t[0].slice(0, 2).toUpperCase() : t.slice(0, 2).map((e) => e[0]).join("").toUpperCase();
}
//#endregion
//#region src/styles.ts
var Ze = o`
  :host {
    display: block;
    color: var(--primary-text-color, #f8f8fa);
    font-family:
      -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI",
      sans-serif;
  }
  ha-card {
    display: block;
    overflow: hidden;
    padding: clamp(18px, 3vw, 34px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--ha-card-border-radius, 26px);
    background:
      radial-gradient(
        circle at 18% -10%,
        rgba(126, 73, 184, 0.22),
        transparent 34%
      ),
      radial-gradient(
        circle at 96% 20%,
        rgba(20, 104, 111, 0.16),
        transparent 30%
      ),
      linear-gradient(145deg, rgba(30, 29, 36, 0.96), rgba(7, 8, 12, 0.98));
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
  }
  header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin: 0 2px clamp(20px, 3vw, 32px);
  }
  h2 {
    margin: 0;
    color: #fff;
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 650;
    letter-spacing: -0.035em;
  }
  .power {
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    width: 46px;
    height: 46px;
    margin-left: auto;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.58);
    background: radial-gradient(
      circle at 38% 30%,
      #45474d,
      #191a1e 68%,
      #0d0e10
    );
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.16),
      0 5px 12px rgba(0, 0, 0, 0.35);
    cursor: pointer;
    transition:
      color 160ms ease,
      box-shadow 160ms ease,
      transform 160ms ease;
  }
  .power svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-width: 2;
  }
  .power.on {
    border-color: rgba(100, 230, 139, 0.56);
    color: #d8ffe4;
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.18),
      0 0 0 2px rgba(86, 214, 126, 0.17),
      0 0 18px rgba(86, 214, 126, 0.5);
  }
  .power:hover,
  .power:focus-visible {
    color: #fff;
    outline: none;
    transform: scale(1.055);
  }
  .power:active {
    transform: scale(0.94);
  }
  .power.busy {
    opacity: 0.62;
    cursor: wait;
    animation: power-pulse 0.8s ease-in-out infinite alternate;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--launcher-columns), minmax(0, 1fr));
    gap: clamp(17px, 2.2vw, 28px) clamp(13px, 1.8vw, 23px);
  }
  .app {
    min-width: 0;
    padding: 0;
    border: 0;
    color: inherit;
    font: inherit;
    text-align: center;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .app:disabled {
    cursor: wait;
  }
  .art,
  .placeholder {
    position: relative;
    display: grid;
    place-items: center;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 1 / 1;
    transform: translateZ(0);
    transition:
      transform 180ms cubic-bezier(0.2, 0.75, 0.2, 1),
      border-color 180ms ease;
  }
  .art.fallback-artwork,
  .placeholder {
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: clamp(13px, 1.8vw, 21px);
    background: var(--tile-bg, rgba(255, 255, 255, 0.07));
  }
  .app:hover .art,
  .app:focus-visible .art {
    border-color: rgba(255, 255, 255, 0.52);
    transform: translateY(-4px) scale(1.035);
  }
  .app:active .art {
    transform: scale(0.97);
  }
  .app:focus-visible {
    outline: none;
  }
  .app.active .art {
    border-color: rgba(255, 255, 255, 0.92);
  }
  .fallback {
    color: var(--tile-fg);
    font-size: clamp(19px, 3vw, 36px);
    font-weight: 760;
    letter-spacing: -0.045em;
  }
  .art img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.012);
  }
  .art img.contain {
    object-fit: contain;
  }
  .label {
    display: block;
    overflow: hidden;
    margin: 10px 5px 0;
    color: rgba(255, 255, 255, 0.88);
    font-size: clamp(11px, 1.4vw, 14px);
    font-weight: 510;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .app.active .label {
    color: #fff;
    font-weight: 650;
  }
  .spinner {
    position: absolute;
    width: 25px;
    height: 25px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  .placeholder {
    background: rgba(255, 255, 255, 0.055);
    animation: shimmer 1.25s ease-in-out infinite alternate;
    animation-delay: var(--delay);
  }
  .empty {
    display: grid;
    gap: 7px;
    min-height: 150px;
    place-content: center;
    padding: 20px;
    color: rgba(255, 255, 255, 0.55);
    text-align: center;
  }
  .empty strong {
    color: rgba(255, 255, 255, 0.88);
    font-size: 17px;
  }
  .error {
    margin-top: 22px;
    padding: 12px 14px;
    border: 1px solid rgba(255, 120, 120, 0.25);
    border-radius: 12px;
    color: #ffc5c5;
    font-size: 13px;
    background: rgba(150, 30, 30, 0.18);
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes power-pulse {
    to {
      filter: brightness(1.28);
    }
  }
  @keyframes shimmer {
    from {
      opacity: 0.45;
    }
    to {
      opacity: 1;
    }
  }
  @media (max-width: 600px) {
    ha-card {
      padding: 18px 14px 22px;
      border-radius: 22px;
    }
    header {
      margin-bottom: 20px;
    }
    .grid {
      grid-template-columns: repeat(
        var(--launcher-mobile-columns),
        minmax(0, 1fr)
      );
      gap: 17px 11px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .art {
      transition: none;
    }
    .app:hover .art,
    .app:focus-visible .art {
      transform: none;
    }
    .placeholder,
    .spinner {
      animation-duration: 2.5s;
    }
    .power.busy {
      animation: none;
    }
  }
`, $ = "apple-tv-launcher-card", Qe = "0.1.0", $e = (e) => new Promise((t) => window.setTimeout(t, e));
function et(e, t) {
	return {
		name: e,
		id: t,
		artwork: null,
		artworkFallback: null,
		artworkFit: "cover",
		unframedArtwork: !1
	};
}
function tt(e) {
	return e instanceof Error ? e.message : String(e);
}
var nt = class extends z {
	constructor(...e) {
		super(...e), this._apps = [], this._loading = !0, this._launching = null, this._powering = !1, this._error = "", this._loadGeneration = 0, this._sourceSignature = "", this._discoveryConfigSignature = "";
	}
	static {
		this.styles = Ze;
	}
	static getStubConfig() {
		return {
			entity: "media_player.apple_tv",
			columns: Z.columns,
			mobile_columns: Z.mobile_columns
		};
	}
	static getConfigForm() {
		let e = {
			entity: "Apple TV entity",
			title: "Title",
			columns: "Icons per row",
			mobile_columns: "Mobile icons per row",
			show_labels: "Show app names",
			artwork_lookup: "Look up App Store artwork",
			artwork_country: "Preferred App Store country",
			wake_before_launch: "Wake before launching",
			wake_delay: "Wake delay (milliseconds)",
			retry: "Retry once after a failed launch"
		};
		return {
			schema: [
				{
					name: "entity",
					required: !0,
					selector: { entity: { filter: {
						domain: "media_player",
						integration: "apple_tv"
					} } }
				},
				{
					name: "title",
					selector: { text: {} }
				},
				{
					type: "grid",
					name: "",
					flatten: !0,
					column_min_width: "160px",
					schema: [{
						name: "columns",
						default: Z.columns,
						selector: { number: {
							min: 2,
							max: 10,
							step: 1,
							mode: "box"
						} }
					}, {
						name: "mobile_columns",
						default: Z.mobile_columns,
						selector: { number: {
							min: 2,
							max: 6,
							step: 1,
							mode: "box"
						} }
					}]
				},
				{
					name: "show_labels",
					default: !0,
					selector: { boolean: {} }
				},
				{
					type: "expandable",
					name: "",
					title: "Artwork and launch behavior",
					icon: "mdi:tune-variant",
					flatten: !0,
					schema: [
						{
							name: "artwork_lookup",
							default: !0,
							selector: { boolean: {} }
						},
						{
							name: "artwork_country",
							default: Z.artwork_country,
							selector: { text: { type: "text" } }
						},
						{
							name: "wake_before_launch",
							default: !0,
							selector: { boolean: {} }
						},
						{
							name: "wake_delay",
							default: Z.wake_delay,
							selector: { number: {
								min: 0,
								max: 15e3,
								step: 250,
								mode: "box"
							} }
						},
						{
							name: "retry",
							default: !0,
							selector: { boolean: {} }
						}
					]
				}
			],
			computeLabel: (t) => e[t.name],
			computeHelper: (e) => {
				if (e.name === "artwork_country") return "Two-letter storefront code, for example nz, gb or us.";
				if (e.name === "wake_delay") return "Time allowed for tvOS to wake before the app launch is sent.";
			},
			assertConfig: (e) => {
				for (let t of [
					"app_order",
					"include",
					"exclude"
				]) if (e[t] !== void 0 && !Array.isArray(e[t])) throw Error(`'${t}' must be a YAML list.`);
				if (e.artwork !== void 0 && (!e.artwork || typeof e.artwork != "object" || Array.isArray(e.artwork))) throw Error("'artwork' must be a YAML mapping.");
			}
		};
	}
	setConfig(e) {
		let t = Ke(e), n = this._discoveryConfigSignature;
		this._config = t, this._discoveryConfigSignature = JSON.stringify([
			t.entity,
			t.artwork_lookup,
			t.artwork_country,
			t.app_order,
			t.include,
			t.exclude,
			t.artwork
		]), this.requestUpdate(), n !== this._discoveryConfigSignature && this._scheduleLoad();
	}
	set hass(e) {
		let t = this._hass;
		this._hass = e, this.requestUpdate("hass", t);
		let n = this._entityState?.attributes.source_list ?? [], r = `${this._config?.entity ?? ""}|${n.join("|")}`;
		r !== this._sourceSignature && (this._sourceSignature = r, this._scheduleLoad());
	}
	get hass() {
		return this._hass;
	}
	connectedCallback() {
		super.connectedCallback(), this._scheduleLoad();
	}
	getCardSize() {
		let e = this._config?.columns ?? Z.columns;
		return Math.max(2, Math.ceil((this._apps.length || e) / e) * 2);
	}
	get _entityState() {
		let e = this._config?.entity;
		return e ? this._hass?.states[e] : void 0;
	}
	_scheduleLoad() {
		if (!this.isConnected || !this._hass || !this._config) return;
		let e = ++this._loadGeneration;
		queueMicrotask(() => void this._loadApps(e));
	}
	async _loadApps(e) {
		let t = this._hass, n = this._config;
		if (!t || !n) return;
		this._loading = !0, this._error = "", this.requestUpdate();
		let r;
		try {
			r = ((await t.callWS({
				type: "media_player/browse_media",
				entity_id: n.entity,
				media_content_type: "apps",
				media_content_id: "apps"
			})).children ?? []).filter((e) => e?.title).map((e) => et(String(e.title), e.media_content_id ? String(e.media_content_id) : null));
		} catch {
			r = (this._entityState?.attributes.source_list ?? []).map((e) => et(String(e), null));
		}
		if (e !== this._loadGeneration) return;
		r = Je(r, n), this._apps = r, this._loading = !1, this.requestUpdate();
		let i = await Promise.all(r.map((e) => Ue(e, n, t)));
		e === this._loadGeneration && (this._apps = i, this.requestUpdate());
	}
	async _launch(e) {
		let t = this._hass, n = this._config;
		if (this._launching || !t || !n) return;
		this._launching = e.name, this._error = "", this.requestUpdate();
		let r = async () => {
			n.wake_before_launch && (await t.callService("media_player", "turn_on", {}, { entity_id: n.entity }), n.wake_delay && await $e(n.wake_delay));
		}, i = () => t.callService("media_player", "select_source", { source: e.name }, { entity_id: n.entity });
		try {
			await r();
			try {
				await i();
			} catch (e) {
				if (!n.retry) throw e;
				await r(), await i();
			}
		} catch (t) {
			this._notify(`Could not launch ${e.name}: ${tt(t)}`);
		} finally {
			this._launching = null, this.requestUpdate();
		}
	}
	async _togglePower() {
		let e = this._hass, t = this._config;
		if (this._powering || !e || !t) return;
		let n = !Ye(this._entityState);
		this._powering = !0, this.requestUpdate();
		try {
			await e.callService("media_player", n ? "turn_on" : "turn_off", {}, { entity_id: t.entity });
		} catch (e) {
			this._notify(`Could not turn Apple TV ${n ? "on" : "off"}: ${tt(e)}`);
		} finally {
			this._powering = !1, this.requestUpdate();
		}
	}
	_notify(e) {
		this._error = e, this.dispatchEvent(new CustomEvent("hass-notification", {
			bubbles: !0,
			composed: !0,
			detail: { message: e }
		})), this.requestUpdate();
	}
	_handleArtworkError(e) {
		this._apps = this._apps.map((t) => t === e ? t.artworkFallback ? {
			...t,
			artwork: t.artworkFallback,
			artworkFallback: null,
			unframedArtwork: !1
		} : {
			...t,
			artwork: null,
			unframedArtwork: !1
		} : t), this.requestUpdate();
	}
	render() {
		let e = this._config;
		if (!e) return M;
		let t = this._entityState, n = Ye(t), r = e.title ?? t?.attributes.friendly_name ?? "Apple TV", i = t?.attributes.app_name ?? t?.attributes.source ?? "";
		return A`
      <ha-card style=${q({
			"--launcher-columns": String(e.columns),
			"--launcher-mobile-columns": String(e.mobile_columns)
		})} aria-busy=${this._loading}>
        <header>
          ${r ? A`<h2>${r}</h2>` : M}
          <button
            class=${U({
			power: !0,
			on: n,
			off: !n,
			busy: this._powering
		})}
            type="button"
            aria-label=${`Turn Apple TV ${n ? "off" : "on"}`}
            aria-pressed=${n}
            title=${`Turn Apple TV ${n ? "off" : "on"}`}
            ?disabled=${this._powering}
            @click=${() => void this._togglePower()}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5v9M7.3 5.9a8 8 0 1 0 9.4 0"></path>
            </svg>
          </button>
        </header>
        ${this._renderContents(i)}
        ${this._error ? A`<div class="error" role="alert">${this._error}</div>` : M}
      </ha-card>
    `;
	}
	_renderContents(e) {
		if (this._loading) {
			let e = Math.max(this._config?.columns ?? Z.columns, 5);
			return A`<div class="grid">
        ${Array.from({ length: e }, (e, t) => A`
            <div
              class="placeholder"
              aria-hidden="true"
              style=${q({ "--delay": `${t * 45}ms` })}
            ></div>
          `)}
      </div>`;
		}
		return this._apps.length ? A`<div class="grid">
      ${Pe(this._apps, (e) => `${e.id ?? "source"}|${e.name}`, (t) => this._renderApp(t, e))}
    </div>` : A`<div class="empty">
        <strong
          >${["unavailable", "unknown"].includes(this._entityState?.state ?? "unknown") ? "Apple TV unavailable" : "No launchable apps found"}</strong
        >
        <span>
          Check that the built-in Apple TV integration is connected and
          Companion-paired.
        </span>
      </div>`;
	}
	_renderApp(e, t) {
		let [n, r] = ze(e.name), i = t.toLocaleLowerCase() === e.name.toLocaleLowerCase(), a = this._launching === e.name;
		return A`
      <button
        class=${U({
			app: !0,
			active: i,
			launching: a
		})}
        type="button"
        aria-label=${`Launch ${e.name}`}
        aria-pressed=${i}
        ?disabled=${!!this._launching}
        @click=${() => void this._launch(e)}
      >
        <span
          class=${U({
			art: !0,
			"unframed-artwork": e.unframedArtwork,
			"fallback-artwork": !e.unframedArtwork
		})}
          style=${q({
			"--tile-bg": n,
			"--tile-fg": r
		})}
        >
          <span class="fallback">${Xe(e.name)}</span>
          ${e.artwork ? A`<img
                  class=${U({ contain: e.artworkFit === "contain" })}
                  src=${e.artwork}
                  alt=""
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  @error=${() => this._handleArtworkError(e)}
                />` : M}
          ${a ? A`<span class="spinner" aria-hidden="true"></span>` : M}
        </span>
        ${this._config?.show_labels ? A`<span class="label">${e.name}</span>` : M}
      </button>
    `;
	}
};
customElements.get("apple-tv-launcher-card") || customElements.define($, nt), window.customCards = window.customCards ?? [], window.customCards.some((e) => e.type === "apple-tv-launcher-card") || window.customCards.push({
	type: $,
	name: "Apple TV Launcher Card",
	description: "A tvOS-style launcher for apps exposed by Home Assistant's Apple TV integration.",
	preview: !0,
	documentationURL: "https://github.com/froog/hacs-apple-launcher"
}), console.info(`%c APPLE TV LAUNCHER %c ${Qe} `, "color:#fff;background:#1c1c20;font-weight:700;padding:3px 6px;border-radius:5px 0 0 5px", "color:#111;background:#f5f5f7;padding:3px 6px;border-radius:0 5px 5px 0");
//#endregion
export { nt as AppleTvLauncherCard, $ as CARD_TAG, Qe as CARD_VERSION };

//# sourceMappingURL=apple-tv-launcher-card.js.map