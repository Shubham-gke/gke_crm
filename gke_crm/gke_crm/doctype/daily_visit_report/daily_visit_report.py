# Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class DailyVisitReport(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		approval_status: DF.Literal["Pending Approval", "Approved", "Rejected"]
		approved_by: DF.Link | None
		branch: DF.Literal["Surat", "Mumbai", "Ahmedabad", "Jaipur"]
		category_of_interest: DF.SmallText | None
		client: DF.Literal[None]
		client_category: DF.Literal["A", "B", "C", "D"]
		client_type: DF.Literal["Existing Client", "New Client"]
		contact_person: DF.Data | None
		discussion: DF.SmallText | None
		expected_order: DF.Float
		follow_up_action: DF.SmallText | None
		lead_address: DF.SmallText | None
		lead_email: DF.Data | None
		lead_location: DF.Data | None
		lead_mobile: DF.Data | None
		lead_status: DF.Literal["", "New", "Contacted", "In-Process", "Converted", "Not-Interested"]
		manager_remarks: DF.SmallText | None
		mobile_number: DF.Data | None
		nature_of_business: DF.Literal["", "Job work", "Outright"]
		next_visit_date: DF.Date | None
		no_of_stores: DF.Int
		parent_lead: DF.Link | None
		party_name: DF.Data | None
		person_name: DF.Data | None
		priority: DF.Literal["Low", "Medium", "High", "Critical"]
		products_pitched: DF.Data | None
		purpose: DF.Link
		rejection_remarks: DF.SmallText | None
		remarks: DF.Data | None
		reporting_manager: DF.Link | None
		sales_executive_name: DF.Data | None
		sales_gm: DF.Float
		sales_person: DF.Link
		selection: DF.Literal["", "Yes", "No"]
		status: DF.Link
		visit_date: DF.Date
		visit_photo: DF.AttachImage | None
		visit_type: DF.Link
	# end: auto-generated types

	# @frappe.whitelist()
	# def create_dvr(visit_date, customer, purpose):

	# 	doc = frappe.get_doc({
	# 		"doctype": "Daily Visit Report",
	# 		"visit_date": visit_date,
	# 		"customer": customer,
	# 		"purpose": purpose
	# 	})

	# 	doc.insert()

	# 	return doc.name



# import frappe


