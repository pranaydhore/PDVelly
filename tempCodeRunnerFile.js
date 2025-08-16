// global middleware
app.use((err, req, res, next) => {
    // Treat invalid ObjectId as 404
    if (err.name === "CastError") {
        err = new ExpressError(404, "Page Not Found");
    }

    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error", { statusCode, message });
    console.log(message);
});