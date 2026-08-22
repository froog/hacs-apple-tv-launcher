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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, ee = h.trustedTypes, te = ee ? ee.emptyScript : "", ne = h.reactiveElementPolyfillSupport, g = (e, t) => e, _ = {
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
}, re = (e, t) => !l(e, t), ie = {
	attribute: !0,
	type: String,
	converter: _,
	reflect: !1,
	useDefault: !1,
	hasChanged: re
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var v = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ie) {
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
		return this.elementProperties.get(e) ?? ie;
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
			let i = (n.converter?.toAttribute === void 0 ? _ : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? _ : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? re)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[g("elementProperties")] = /* @__PURE__ */ new Map(), v[g("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: v }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var y = globalThis, ae = (e) => e, b = y.trustedTypes, oe = b ? b.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, x = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, C = "?" + S, se = `<${C}>`, w = document, T = () => w.createComment(""), E = (e) => e === null || typeof e != "object" && typeof e != "function", D = Array.isArray, ce = (e) => D(e) || typeof e?.[Symbol.iterator] == "function", O = "[ 	\n\f\r]", k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, le = /-->/g, ue = />/g, A = RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), de = /'/g, fe = /"/g, pe = /^(?:script|style|textarea|title)$/i, j = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), M = Symbol.for("lit-noChange"), N = Symbol.for("lit-nothing"), me = /* @__PURE__ */ new WeakMap(), P = w.createTreeWalker(w, 129);
function he(e, t) {
	if (!D(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return oe === void 0 ? t : oe.createHTML(t);
}
var ge = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = k;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === k ? c[1] === "!--" ? o = le : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = A) : (pe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = A) : o = ue : o === A ? c[0] === ">" ? (o = i ?? k, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? A : c[3] === "\"" ? fe : de) : o === fe || o === de ? o = A : o === le || o === ue ? o = k : (o = A, i = void 0);
		let d = o === A && e[t + 1].startsWith("/>") ? " " : "";
		a += o === k ? n + se : l >= 0 ? (r.push(s), n.slice(0, l) + x + n.slice(l) + S + d) : n + S + (l === -2 ? t : d);
	}
	return [he(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, F = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ge(t, n);
		if (this.el = e.createElement(l, r), P.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = P.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(x)) {
					let t = u[o++], n = i.getAttribute(e).split(S), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ve : r[1] === "?" ? ye : r[1] === "@" ? be : R
					}), i.removeAttribute(e);
				} else e.startsWith(S) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (pe.test(i.tagName)) {
					let e = i.textContent.split(S), t = e.length - 1;
					if (t > 0) {
						i.textContent = b ? b.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], T()), P.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], T());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === C) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(S, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += S.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = w.createElement("template");
		return n.innerHTML = e, n;
	}
};
function I(e, t, n = e, r) {
	if (t === M) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = E(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = I(e, i._$AS(e, t.values), i, r)), t;
}
var _e = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? w).importNode(t, !0);
		P.currentNode = r;
		let i = P.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new L(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new xe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = P.nextNode(), a++);
		}
		return P.currentNode = w, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, L = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = N, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = I(this, e, t), E(e) ? e === N || e == null || e === "" ? (this._$AH !== N && this._$AR(), this._$AH = N) : e !== this._$AH && e !== M && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ce(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== N && E(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = F.createElement(he(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new _e(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = me.get(e.strings);
		return t === void 0 && me.set(e.strings, t = new F(e)), t;
	}
	k(t) {
		D(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(T()), this.O(T()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ae(e).nextSibling;
			ae(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, R = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = N, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = N;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = I(this, e, t, 0), a = !E(e) || e !== this._$AH && e !== M, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = I(this, r[n + o], t, o), s === M && (s = this._$AH[o]), a ||= !E(s) || s !== this._$AH[o], s === N ? e = N : e !== N && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === N ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ve = class extends R {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === N ? void 0 : e;
	}
}, ye = class extends R {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== N);
	}
}, be = class extends R {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = I(this, e, t, 0) ?? N) === M) return;
		let n = this._$AH, r = e === N && n !== N || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== N && (n === N || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, xe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		I(this, e);
	}
}, Se = {
	M: x,
	P: S,
	A: C,
	C: 1,
	L: ge,
	R: _e,
	D: ce,
	V: I,
	I: L,
	H: R,
	N: ye,
	U: be,
	B: ve,
	F: xe
}, Ce = y.litHtmlPolyfillSupport;
Ce?.(F, L), (y.litHtmlVersions ??= []).push("3.3.3");
var we = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new L(t.insertBefore(T(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, z = globalThis, B = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = we(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return M;
	}
};
B._$litElement$ = !0, B.finalized = !0, z.litElementHydrateSupport?.({ LitElement: B });
var Te = z.litElementPolyfillSupport;
Te?.({ LitElement: B }), (z.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/lit-html/directive.js
var V = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, H = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), U = class {
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
}, W = H(class extends U {
	constructor(e) {
		if (super(e), e.type !== V.ATTRIBUTE || e.name !== "class" || e.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
		return M;
	}
}), { I: Ee } = Se, De = (e) => e, Oe = () => document.createComment(""), G = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new Ee(r.insertBefore(Oe(), i), r.insertBefore(Oe(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = De(e).nextSibling;
				De(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, K = (e, t, n = e) => (e._$AI(t, n), e), ke = {}, Ae = (e, t = ke) => e._$AH = t, je = (e) => e._$AH, q = (e) => {
	e._$AR(), e._$AA.remove();
}, Me = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, Ne = H(class extends U {
	constructor(e) {
		if (super(e), e.type !== V.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = je(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = K(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = K(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = K(i[d], a[m]), G(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = K(i[f], a[p]), G(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = Me(o, p, m), u = Me(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = G(e, i[d]);
					K(t, a[p]), c[p] = t;
				} else c[p] = K(n, a[p]), G(e, i[d], n), i[t] = null;
				p++;
			} else q(i[f]), f--;
		} else q(i[d]), d++;
		for (; p <= m;) {
			let t = G(e, c[m + 1]);
			K(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && q(e);
		}
		return this.ut = o, Ae(e, c), M;
	}
}), Pe = "important", Fe = " !" + Pe, J = H(class extends U {
	constructor(e) {
		if (super(e), e.type !== V.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
				let t = typeof r == "string" && r.endsWith(Fe);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? Pe : "") : n[e] = r;
			}
		}
		return M;
	}
}), Ie = "data:image/png;base64,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", Le = "data:image/png;base64,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", Re = "data:image/png;base64,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", ze = "data:image/png;base64,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", Be = [
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
], Ve = {
	"com.apple.TVWatchList": { trackId: 1174078549 },
	"com.apple.TVMusic": { trackId: 1108187390 },
	"com.apple.TVPhotos": { trackId: 1584215428 },
	"com.apple.Arcade": { url: "https://developer.apple.com/assets/elements/icons/arcade/arcade-128x128_2x.png" },
	"com.apple.TVAppStore": { url: "https://developer.apple.com/assets/elements/icons/app-store/app-store-128x128_2x.png" },
	"com.apple.TVSearch": {
		url: Le,
		unframed: !1
	},
	"com.apple.TVSettings": {
		url: Ie,
		unframed: !1
	},
	"com.apple.Sing": {
		url: Re,
		unframed: !1
	},
	"com.apple.TVHomeSharing": {
		url: ze,
		unframed: !1
	}
}, Y = /* @__PURE__ */ new Map();
function He(e) {
	let t = Be.find(([t]) => t.test(e));
	if (t) return t[1];
	let n = 0;
	for (let t of e) n = (n << 5) - n + t.charCodeAt(0) | 0;
	return [`hsl(${Math.abs(n) % 360} 54% 39%)`, "#ffffff"];
}
function X(e, t) {
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
async function Z(e, t, n) {
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
function Ue(e, t) {
	let n = e.startsWith("uk.") || e.startsWith("com.itv.") ? "gb" : e.startsWith("nz.") ? "nz" : t;
	return [.../* @__PURE__ */ new Set([
		n,
		t,
		"us",
		"gb"
	])];
}
function We(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.primary == "string" && (t.fallback === null || typeof t.fallback == "string") && typeof t.unframed == "boolean" && (t.trackId === void 0 || Number.isInteger(t.trackId));
}
async function Ge(e, t, n) {
	let r = `${e}|${t}`;
	if (Y.has(r)) return Y.get(r) ?? null;
	let i = `apple-tv-launcher-artwork-v4:${r}`;
	try {
		let e = window.localStorage.getItem(i);
		if (e === "-") return Y.set(r, null), null;
		if (e) {
			let i = JSON.parse(e);
			if (We(i)) return i.trackId && (i.primary = await Z(n, i.trackId, t) ?? X(i.trackId, t)), Y.set(r, i), i;
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
				primary: await Z(n, e.trackId, t) ?? X(e.trackId, t),
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
	Y.set(r, a);
	try {
		window.localStorage.setItem(i, a ? JSON.stringify(a) : "-");
	} catch {}
	return a;
}
async function Ke(e, t, n) {
	let r = e.id && t.artwork[e.id] || t.artwork[e.name];
	if (r) return {
		...e,
		artwork: r,
		artworkFallback: null,
		artworkFit: "cover",
		unframedArtwork: !1
	};
	if (!t.artwork_lookup) return e;
	let i = e.id ? Ve[e.id] : void 0;
	if (i) {
		let r = i.trackId ? X(i.trackId, t.artwork_country) : i.url ?? null, a = i.trackId ? await Z(n, i.trackId, t.artwork_country) : null;
		return {
			...e,
			artwork: a ?? r,
			artworkFallback: null,
			artworkFit: i.fit ?? "cover",
			unframedArtwork: i.unframed !== !1
		};
	}
	if (!e.id) return e;
	for (let r of Ue(e.id, t.artwork_country)) {
		let t = await Ge(e.id, r, n);
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
var Q = Object.freeze({
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
function qe(e, t, n, r) {
	let i = Number(e);
	return Number.isFinite(i) ? Math.min(n, Math.max(t, Math.round(i))) : r;
}
function Je(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function $(e, t) {
	return typeof e == "boolean" ? e : t;
}
function Ye(e) {
	if (!e?.entity || !String(e.entity).startsWith("media_player.")) throw Error("Apple TV Launcher requires a media_player entity");
	let t = String(e.artwork_country ?? Q.artwork_country).trim().toLowerCase();
	return {
		entity: String(e.entity),
		...e.title === void 0 ? {} : { title: String(e.title) },
		columns: qe(e.columns, 2, 10, Q.columns),
		mobile_columns: qe(e.mobile_columns, 2, 6, Q.mobile_columns),
		show_labels: $(e.show_labels, Q.show_labels),
		artwork_lookup: $(e.artwork_lookup, Q.artwork_lookup),
		artwork_country: /^[a-z]{2}$/.test(t) ? t : Q.artwork_country,
		wake_before_launch: $(e.wake_before_launch, Q.wake_before_launch),
		wake_delay: qe(e.wake_delay, 0, 15e3, Q.wake_delay),
		retry: $(e.retry, Q.retry),
		app_order: Je(e.app_order),
		include: Je(e.include),
		exclude: Je(e.exclude),
		artwork: e.artwork && typeof e.artwork == "object" && !Array.isArray(e.artwork) ? Object.fromEntries(Object.entries(e.artwork).map(([e, t]) => [e, String(t)])) : {}
	};
}
function Xe(e, t) {
	let n = new Set(t.map((e) => e.toLocaleLowerCase()));
	return n.has(e.name.toLocaleLowerCase()) || !!(e.id && n.has(e.id.toLocaleLowerCase()));
}
function Ze(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.filter((e) => {
		let t = `${e.name.toLocaleLowerCase()}|${e.id?.toLocaleLowerCase() ?? ""}`;
		return !n.has(t) && (n.add(t), !0);
	}), i = (t.include.length ? r.filter((e) => Xe(e, t.include)) : r).filter((e) => !Xe(e, t.exclude)), a = new Map(t.app_order.map((e, t) => [e.toLocaleLowerCase(), t])), o = (e) => a.get(e.name.toLocaleLowerCase()) ?? (e.id ? a.get(e.id.toLocaleLowerCase()) : void 0) ?? 2 ** 53 - 1;
	return i.sort((e, t) => o(e) - o(t) || e.name.localeCompare(t.name));
}
function Qe(e) {
	return !!(e && ![
		"off",
		"unavailable",
		"unknown"
	].includes(e.state));
}
function $e(e) {
	let t = e.split(/\s+/).filter(Boolean);
	return t.length === 1 ? t[0].slice(0, 2).toUpperCase() : t.slice(0, 2).map((e) => e[0]).join("").toUpperCase();
}
//#endregion
//#region src/styles.ts
var et = o`
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
`, tt = "apple-tv-launcher-card", nt = "0.1.0", rt = (e) => new Promise((t) => window.setTimeout(t, e));
function it(e, t) {
	return {
		name: e,
		id: t,
		artwork: null,
		artworkFallback: null,
		artworkFit: "cover",
		unframedArtwork: !1
	};
}
function at(e) {
	return e instanceof Error ? e.message : String(e);
}
var ot = class extends B {
	constructor(...e) {
		super(...e), this._apps = [], this._loading = !0, this._launching = null, this._powering = !1, this._error = "", this._loadGeneration = 0, this._sourceSignature = "", this._discoveryConfigSignature = "";
	}
	static {
		this.styles = et;
	}
	static getStubConfig() {
		return {
			entity: "media_player.apple_tv",
			columns: Q.columns,
			mobile_columns: Q.mobile_columns
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
						default: Q.columns,
						selector: { number: {
							min: 2,
							max: 10,
							step: 1,
							mode: "box"
						} }
					}, {
						name: "mobile_columns",
						default: Q.mobile_columns,
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
							default: Q.artwork_country,
							selector: { text: { type: "text" } }
						},
						{
							name: "wake_before_launch",
							default: !0,
							selector: { boolean: {} }
						},
						{
							name: "wake_delay",
							default: Q.wake_delay,
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
		let t = Ye(e), n = this._discoveryConfigSignature;
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
		let e = this._config?.columns ?? Q.columns;
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
			})).children ?? []).filter((e) => e?.title).map((e) => it(String(e.title), e.media_content_id ? String(e.media_content_id) : null));
		} catch {
			r = (this._entityState?.attributes.source_list ?? []).map((e) => it(String(e), null));
		}
		if (e !== this._loadGeneration) return;
		r = Ze(r, n), this._apps = r, this._loading = !1, this.requestUpdate();
		let i = await Promise.all(r.map((e) => Ke(e, n, t)));
		e === this._loadGeneration && (this._apps = i, this.requestUpdate());
	}
	async _launch(e) {
		let t = this._hass, n = this._config;
		if (this._launching || !t || !n) return;
		this._launching = e.name, this._error = "", this.requestUpdate();
		let r = async () => {
			n.wake_before_launch && (await t.callService("media_player", "turn_on", {}, { entity_id: n.entity }), n.wake_delay && await rt(n.wake_delay));
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
			this._notify(`Could not launch ${e.name}: ${at(t)}`);
		} finally {
			this._launching = null, this.requestUpdate();
		}
	}
	async _togglePower() {
		let e = this._hass, t = this._config;
		if (this._powering || !e || !t) return;
		let n = !Qe(this._entityState);
		this._powering = !0, this.requestUpdate();
		try {
			await e.callService("media_player", n ? "turn_on" : "turn_off", {}, { entity_id: t.entity });
		} catch (e) {
			this._notify(`Could not turn Apple TV ${n ? "on" : "off"}: ${at(e)}`);
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
		if (!e) return N;
		let t = this._entityState, n = Qe(t), r = e.title ?? t?.attributes.friendly_name ?? "Apple TV", i = t?.attributes.app_name ?? t?.attributes.source ?? "";
		return j`
      <ha-card style=${J({
			"--launcher-columns": String(e.columns),
			"--launcher-mobile-columns": String(e.mobile_columns)
		})} aria-busy=${this._loading}>
        <header>
          ${r ? j`<h2>${r}</h2>` : N}
          <button
            class=${W({
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
        ${this._error ? j`<div class="error" role="alert">${this._error}</div>` : N}
      </ha-card>
    `;
	}
	_renderContents(e) {
		if (this._loading) {
			let e = Math.max(this._config?.columns ?? Q.columns, 5);
			return j`<div class="grid">
        ${Array.from({ length: e }, (e, t) => j`
            <div
              class="placeholder"
              aria-hidden="true"
              style=${J({ "--delay": `${t * 45}ms` })}
            ></div>
          `)}
      </div>`;
		}
		return this._apps.length ? j`<div class="grid">
      ${Ne(this._apps, (e) => `${e.id ?? "source"}|${e.name}`, (t) => this._renderApp(t, e))}
    </div>` : j`<div class="empty">
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
		let [n, r] = He(e.name), i = t.toLocaleLowerCase() === e.name.toLocaleLowerCase(), a = this._launching === e.name;
		return j`
      <button
        class=${W({
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
          class=${W({
			art: !0,
			"unframed-artwork": e.unframedArtwork,
			"fallback-artwork": !e.unframedArtwork
		})}
          style=${J({
			"--tile-bg": n,
			"--tile-fg": r
		})}
        >
          <span class="fallback">${$e(e.name)}</span>
          ${e.artwork ? j`<img
                  class=${W({ contain: e.artworkFit === "contain" })}
                  src=${e.artwork}
                  alt=""
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  @error=${() => this._handleArtworkError(e)}
                />` : N}
          ${a ? j`<span class="spinner" aria-hidden="true"></span>` : N}
        </span>
        ${this._config?.show_labels ? j`<span class="label">${e.name}</span>` : N}
      </button>
    `;
	}
};
customElements.get("apple-tv-launcher-card") || customElements.define(tt, ot), window.customCards = window.customCards ?? [], window.customCards.some((e) => e.type === "apple-tv-launcher-card") || window.customCards.push({
	type: tt,
	name: "Apple TV Launcher Card",
	description: "A tvOS-style launcher for apps exposed by Home Assistant's Apple TV integration.",
	preview: !0,
	documentationURL: "https://github.com/froog/hacs-apple-launcher"
}), console.info(`%c APPLE TV LAUNCHER %c ${nt} `, "color:#fff;background:#1c1c20;font-weight:700;padding:3px 6px;border-radius:5px 0 0 5px", "color:#111;background:#f5f5f7;padding:3px 6px;border-radius:0 5px 5px 0");
//#endregion
export { ot as AppleTvLauncherCard, tt as CARD_TAG, nt as CARD_VERSION };

//# sourceMappingURL=apple-tv-launcher-card.js.map