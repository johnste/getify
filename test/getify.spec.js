define(['lib/getify'], (getify) => {
	describe("getify", () => {

		it("should get simple properties from objects", () => {
			expect(getify({a:23}).a(), 'obj.a').to.be.equal(23)
			expect(getify({a:23,b:12}).a(), 'obj.a').to.be.equal(23)
			expect(getify({a:23,b:12}).b(), 'obj.a').to.be.equal(12)
			expect(getify({a:23,b:12}).c(), 'obj.a').to.be.undefined
		})

		it("should get existing properties from objects", () => {
			const obj = {
				a: 23,
				b: [1, 2, 3],
				c: {
					d: "123"
				},
				f: [undefined, { g: "321" }]
			}
			expect(getify(obj).a(), 'obj.a').to.be.equal(23)
			expect(getify(obj).b[2](), 'obj.b[2]').to.be.equal(3)
			expect(getify(obj).c.d(), 'obj.c.d').to.be.equal("123")
			expect(getify(obj).c.d[1](), 'obj.c.d[1]').to.be.equal("2")
			expect(getify(obj).f[1].g(), 'obj.f[1].g').to.be.equal("321")
			expect(getify(obj).f(), 'obj.f').to.be.deep.equal([undefined, { g: "321" }])
		})

		it("should return default value when on non-existing properties from objects", () => {
			const obj = {
				a: 23,
				b: [1, 2, 3],
				c: {
					d: "123"
				},
				f: [undefined, { g: "321" }]
			}
			expect(getify(obj).a.b(), 'obj.a.b').to.be.undefined
			expect(getify(obj).b[4](), 'obj.b[4]').to.be.undefined
			expect(getify(obj).d(), 'obj.d').to.be.undefined
			expect(getify(obj).f[1].x.x(), 	'obj.f[1].x.x').to.be.undefined

		})

		it("should return the default value for missing properties if one is provided", () => {
			const obj = {
				a: 23,
				b: [1, 2, 3],
				c: {
					d: "123"
				},
				f: [undefined, { g: "321" }]
			}

			expect(getify(obj).a.b("test"), 'obj.a.b("test")').to.be.equal("test")
			expect(getify(obj).b[4](obj), 'obj.b[4](obj)').to.be.deep.equal(obj)
			expect(getify(obj).d(4), 'obj.d(4)').to.be.equal(4)
			expect(getify(obj).f[1].x.x(undefined), 'obj.f[1].x.x(undefined)').to.be.undefined

		})
	})

	describe("getify symbols: all", () => {

		it("should get multiple properties from simple objects", () => {
			const obj = {
				a: {
					i: { x: 1, y: 3 },
					j: { x: 2, y: 4 }
				}
			}

			const result = getify(obj).a[getify.all].x()
			expect(result).to.be.deep.equal([1, 2])
		})

		it("should get multiply values from slightly more complex paths", () => {
			const obj = {
				b: {
					x: { i: { j: [1, 2, 3] } },
					y: { i: { j: [4, 5, 6] } },
					z: { i: { j: [7, 8, 9] } }
				}
			}
			const result = getify(obj).b[getify.all].i.j[0]()
			expect(result).to.be.deep.equal([1, 4, 7])
		})


		it("should be able to chain multiple getify.all paths", () => {
			const obj = {
				a: { x: { a: 1, b: 2 }, i: { b: 7 } },
				b: { y: { a: 3, b: 4 }, j: { b: 8 } },
				c: { z: { a: 5, b: 6 }, k: { b: 9 } }
			}

			const result = getify(obj)[getify.all][getify.all].b()
			expect(result).to.be.deep.equal([[2, 7], [4, 8], [6, 9]])
		})

		it("should get objects from paths, not only simple values", () => {
			const obj = {
				a: { x: 1 },
				b: { y: 2 },
				c: { z: 3 }
			}

			const result = getify(obj)[getify.all]()
			expect(result).to.be.deep.equal([{ x: 1 }, { y: 2 }, { z: 3 }])
		})

		it("should get default value for missing properties", () => {
			const obj = {
				a: { x: { a: 1, b: 2 }, y: { b: 7 } },
				b: { x: { a: 3, b: 4 }, y: { c: 8 } },
				c: { x: { a: 5       }, y: { b: 9 } }
			}

			const result = getify(obj)[getify.all][getify.all].b('test')
			expect(result).to.be.deep.equal([[2, 7], [4, 'test'], ['test', 9]])
		})

		it("should get default values for differently sized missing properties", () => {
			const obj = {
				a: { x: {}, y: {}, z: {} },
				b: { x: {}, y: {} },
				c: { x: {} },
				d: {}
			}

			const result = getify(obj)[getify.all][getify.all].b('test')
			expect(result).to.be.deep.equal([['test', 'test', 'test'], ['test', 'test'], ['test'], []])
		})

		it("should return prototype if requested", () => {
			function Test() {}
			const x = new Test()
			const result = getify(x).__proto__
			expect(result).to.be.equal(Test.prototype)
		})

		it("should be able to get path with symbol", () => {
			const aSymbol = Symbol("Some symbol")
			const obj = { [aSymbol]: 'x' }
			const result = getify(obj)[aSymbol]()
			expect(result).to.be.equal('x')
		})
	})

	describe("getify symbols: first", () => {

		it("should get first property in simple objects", () => {
			const obj = { a: { i: { x: 1, y: 3 } } }
			const result = getify(obj).a[getify.first].x()
			expect(result).to.be.equal(1)
		})

		it("should get first property in arrays", () => {
			const obj = [[[[4, 5], 3], 2], 1]
			const result = getify(obj)[0][getify.first][0][getify.first]()
			expect(result).to.be.equal(4)
		})

		it("should be able to use multiple times", () => {
			const obj = { a: { i: { x: 5, y: 3 } } }
			const result = getify(obj)[getify.first][getify.first][getify.first]()
			expect(result).to.be.equal(5)
		})
	})

	describe("getify symbols: last", () => {

		it("should get last property in simple objects", () => {
			const obj = { a: { i: { x: 1, y: 3 } } }
			const result = getify(obj).a[getify.last].x()
			expect(result).to.be.equal(1)
		})

		it("should get last property in arrays", () => {
			const obj = [1, [2, 3]]
			const result = getify(obj)[1][getify.last]()
			expect(result).to.be.equal(3)
		})

		it("should be able to use multiple times", () => {
			const obj = { a: { i: { x: 5, y: 3 } } }
			const result = getify(obj)[getify.last][getify.last][getify.last]()
			expect(result).to.be.equal(3)
		})
	})
})