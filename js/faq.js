$(".faq-question").each(function () {
    const question = $(this);
    const answer = $("#" + question.attr("aria-controls"));
    const indicator = question.find(".faq-indicator");
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220;

    answer.hide();
    question.prop("disabled", false).attr("aria-expanded", "false");
    indicator.text("+");

    question.on("click", function () {
        const isOpen = question.attr("aria-expanded") === "true";
        question.attr("aria-expanded", String(!isOpen));
        indicator.text(isOpen ? "+" : "−");
        answer.stop(true, true).slideToggle(duration);
    });
});
