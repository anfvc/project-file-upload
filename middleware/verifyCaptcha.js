async function verifyCaptcha(req, res, next) {
  const { recaptcha } = req.body;

  if (!recaptcha) {
    console.log("Missing captcha");
  }

  // try {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${recaptcha}`,
    {
      method: "POST",
    }
  );

  const data = await response.json();
  console.log(data);

  if (!data.success) {
    const error = new Error(data["error-codes"][0]);
    return next(error);
  }


  next();

  //   if (response.ok) { in this case the response will always be ok,
  //     const data = await response.json();
  //     console.log(data);
  //     next()

  //   } else {
  //     console.log("Response wasn't successful");
  //   }
  // } catch (error) {
  //   console.log("Error verifying reCAPTCHA", error);
  //   next(res.status(500).json("Server Error"));
  // }

}

export default verifyCaptcha;
