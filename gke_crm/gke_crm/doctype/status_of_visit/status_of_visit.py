# Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class StatusOfVisit(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		amended_from: DF.Link | None
		purpose_of_visit: DF.Link | None
		status_of_visit: DF.Data | None
		visit_type: DF.Link | None
	# end: auto-generated types

	_DOCTYPE_NAME = "Status Of Visit"
