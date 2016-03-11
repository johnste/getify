define(['lib/getify'], (getify) => {
	describe("getify", function() {
		it("should get existing properties from objects", () => {
			const obj = {
				a: 23,
				b: [1, 2, 3],
				c: {
					d: "123"
				},
				f: [undefined, { g: "321" }]
			}
			expect(getify(obj).a(), 		'obj.a').to.be.equal(23)
			expect(getify(obj).b[2](), 		'obj.b[2]').to.be.equal(3)
			expect(getify(obj).c.d(), 		'obj.c.d').to.be.equal("123")
			expect(getify(obj).c.d[1](), 	'obj.c.d[1]').to.be.equal("2")
			expect(getify(obj).f[1].g(),	'obj.f[1].g').to.be.equal("321")
			expect(getify(obj).f(), 		'obj.f').to.be.deep.equal([undefined, { g: "321" }])
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
			expect(getify(obj).a.b(), 				'obj.a.b').to.be.undefined
			expect(getify(obj).b[4](), 				'obj.b[4]').to.be.undefined
			expect(getify(obj).d(), 				'obj.d').to.be.undefined
			expect(getify(obj).f[1].x.x(), 			'obj.f[1].x.x').to.be.undefined

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

			expect(getify(obj).a.b("test"), 		'obj.a.b("test")').to.be.equal("test")
			expect(getify(obj).b[4](obj), 			'obj.b[4](obj)').to.be.deep.equal(obj)
			expect(getify(obj).d(4), 				'obj.d(4)').to.be.equal(4)
			expect(getify(obj).f[1].x.x(undefined), 'obj.f[1].x.x(undefined)').to.be.undefined

		})
	})
})