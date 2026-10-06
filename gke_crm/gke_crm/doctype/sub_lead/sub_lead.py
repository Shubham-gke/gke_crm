# Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Sublead(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		amended_from: DF.Link | None
		discussion: DF.SmallText | None
		next_visit_date: DF.Date | None
		parent_lead_id: DF.Data
		products_pitched: DF.SmallText | None
		purpose: DF.Link
		selection_made: DF.Literal["Yes", "No"]
		status: DF.Link
		visit_photo: DF.Attach | None
	# end: auto-generated types

	_DOCTYPE_NAME = "Sub lead"
