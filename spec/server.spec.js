var request = require('request')

describe('calc', () => {
	it('should multiply 3 and 2', () => {
		expect(3*2).toBe(6)
	})
})

describe('get messages', () => {
	it('should return 200 OK', (done) => {
		request.get('http://localhost:3000/messages', (err, res) => {
			expect(res.statusCode).toEqual(200)
			done()
		})
	})

	it('should return non emty list', (done) => {
		request.get('http://localhost:3000/messages', (err, res) => {
			expect(JSON.parse(res.body).length).toBeGreaterThan(0)
			done()
		})
	})
})

describe('get message by user', () => {
	it('should return 200 OK', (done) => {
		request.get('http://localhost:3000/messages/John', (err, res) => {
			expect(res.statusCode).toEqual(200)
			done()
		})
	})
	it('name should be john',(done) => {
		request.get('http://localhost:3000/messages/John', (err, res) => {
			expect(JSON.parse(res.body)[0].name).toEqual('John')
			done()
		})
	})

})