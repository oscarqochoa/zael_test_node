import { server, BASE_URL } from './setup';

describe('Bingo test', () => {
  it('create bingo', (done) => {

    const data = { name: 'Bingo4' }

    server
      .post(`${BASE_URL}/api/create-bingo`)
      .send(data)
      .expect(200)
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('code')
        expect(res.body.code).toBeGreaterThan(0)
        expect(res.body.message).toEqual(
          "Bingo created"
        );

        done();
      });
  });

  it('get number if bingo is not full', (done) => {

    const bingoData = { name: 'Bingo4' }

    server
      .post(`${BASE_URL}/api/create-bingo`)
      .send(bingoData)
      .then((res) => {
        expect(res.status).toEqual(200);

        return server.get(`${BASE_URL}/api/get-number/${res.body.code}`)
          .expect(200)
      })
      .then((res) => {
        expect(res.body).toHaveProperty('new_number')
        expect(res.body).toHaveProperty("data")

        done();
      })
  })

  it('generate primer', (done) => {

    const bingoData = { name: 'Bingo' }

    server
      .post(`${BASE_URL}/api/create-bingo`)
      .send(bingoData)
      .then((res) => {
        expect(res.status).toEqual(200);

        return server.post(`${BASE_URL}/api/generate-card/${res.body.code}`)
          .expect(200)
      })
      .then((res) => {
        expect(res.body).toHaveProperty('code')
        expect(res.body).toHaveProperty("bingo")
        expect(res.body.bingo).not.toBeNull()

        done();
      })
  })

  it('check if the card is not complete', (done) => {

    const bingoData = { name: 'Bingo' }
    const primerNumbers = { numbers: "1,2,3,4" }

    server
      .post(`${BASE_URL}/api/create-bingo`)
      .send(bingoData)
      .then((res) => {
        expect(res.status).toEqual(200);

        return server.post(`${BASE_URL}/api/check-winner/${res.body.code}`)
          .send(primerNumbers)
          .expect(200)
      })
      .then((res) => {
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual("The card is not complete")
        done();
      })

  })
})
