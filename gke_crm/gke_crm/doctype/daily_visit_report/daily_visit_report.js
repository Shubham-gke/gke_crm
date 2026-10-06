// Client Script for: Daily Visit Report
// Dummy mapping (abhi ke liye) — jab Client ko Link field bana kar
// live "Customer" doctype se jodoge, tab ye poora block hata kar
// sirf DocType me "fetch_from": "client.customer_category" set kar dena,
// alag se JS ki zaroorat nahi rahegi.

// const dummyCustomerCategoryMap = {
// 	"Tanishq - TAN001": "A",
// 	"Malabar Gold & Diamonds - MAL002": "A",
// 	"Kalyan Jewellers - KAL003": "A",
// 	"Joyalukkas - JOY004": "B",
// 	"TBZ - TBZ005": "B",
// 	"PNG Jewellers - PNG006": "B",
// 	"Senco Gold - SEN007": "C",
// 	"Reliance Jewels - REL008": "D",
// 	"Local Retail Partner - LRP009": "E"
// };

// frappe.ui.form.on("Daily Visit Report", {
// 	client: function (frm) {
// 		if (frm.doc.client_type === "Existing Client" && frm.doc.client) {
// 			const category = dummyCustomerCategoryMap[frm.doc.client] || "";
// 			frm.set_value("client_category", category);
// 		} else {
// 			frm.set_value("client_category", "");
// 		}
// 	},

// 	client_type: function (frm) {
// 		// Client type badalne par purani category clear kar do
// 		if (frm.doc.client_type !== "Existing Client") {
// 			frm.set_value("client_category", "");
// 		}
// 	}
// });