const express = require('express')
const app = express()
const port = 3000
const { PKPass } = require("passkit-generator");
const fs = require("fs");
const path = require("path");

app.get('/', async (req, res) => {
    console.log(fs.existsSync("./cert/wwrdc.pem"))
    console.log(fs.existsSync("./cert/signerCert.pem"))
    console.log(fs.existsSync("./cert/signerKey.pem"))
    console.log(fs.existsSync("wwrdc.pem"))
    console.log(fs.existsSync("signerCert.pem"))
    console.log(fs.existsSync("signerKey.pem"))
    try {
        /** Each, but last, can be either a string or a Buffer. See API Documentation for more */
        // const { wwdr, signerCert, signerKey, signerKeyPassphrase } = getCertificatesContentsSomehow();
        const [signerCert, signerKey, wwdr, signerKeyPassphrase] =
            await Promise.all([
                fs.readFileSync(
                    path.resolve(__dirname, "signerCert.pem"),
                ),
                fs.readFileSync(
                    path.resolve(__dirname, "signerKey.pem"),
                ),
                fs.readFileSync(
                    path.resolve(__dirname, "wwrdc.pem"),
                ),
                Promise.resolve(""),
            ]);
        const pass = await PKPass.from({
            /**
             * Note: .pass extension is enforced when reading a
             * model from FS, even if not specified here below
             */
            model: "./Tickets.pass",
            certificates: {
                wwdr,
                signerCert,
                signerKey,
                signerKeyPassphrase
            },
        });

        // Adding some settings to be written inside pass.json
        pass.setBarcodes("36478105430"); // Random value

        // Generate the stream .pkpass file stream
        // const stream = pass.getAsStream();
        // doSomethingWithTheStream(stream);
        const stream = pass.getAsStream();

		res.set({
			"Content-type": pass.mimeType,
			"Content-disposition": `attachment; filename=balhbalh.pkpass`,
		});

		stream.pipe(res);

        // const buffer = pass.getAsBuffer();
        // res.send({
        //     statusCode: 200,
        //     headers: {
        //         "Content-Type": pass.mimeType,
        //     },
        //     body: buffer.toString("base64"),
        //     isBase64Encoded: true
        // })

    } catch (err) {
        console.log(err)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})