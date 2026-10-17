(() => {
    const originalFetch = window.fetch;

    window.fetch = function (input, init) {
        const url = typeof input === "string" ? input : input?.url;

        if (
            url &&
            url.includes("/api/method/frappe.desk.reportview.get") &&
            init?.body
        ) {
            try {
                const params = new URLSearchParams(init.body);
                const doctype = params.get("doctype");
                const fields = params.get("fields");

                if (doctype === "Daily Visit Report" && fields) {
                    const parsedFields = JSON.parse(fields);

                    const filteredFields = parsedFields.filter(
                        (field) => !field.includes("._comments`")
                    );

                    params.set("fields", JSON.stringify(filteredFields));

                    init = {
                        ...init,
                        body: params.toString(),
                    };
                }
            } catch (error) {
                console.error("DVR list fix:", error);
            }
        }

        return originalFetch.call(this, input, init);
    };
})();
