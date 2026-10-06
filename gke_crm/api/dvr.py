import frappe


import requests
@frappe.whitelist(allow_guest=True)
def get_dvr_for_approval(
    client_type: str | None = None,
    client: str | None = None,
    from_date: str | None = None,
    to_date: str | None = None
):
    user = frappe.session.user
    
    # frappe.throw(f"{user}")

    if user == "Guest":
        frappe.throw("Please login first")

    # Get Employee data from API
    response = requests.get(
        "http://ec2-13-234-27-130.ap-south-1.compute.amazonaws.com:8002/api/method/get_employee_from_gk",
        timeout=10
    )

    response.raise_for_status()

    employee_data = response.json().get("message", [])
    
    # frappe.throw(f"{employee_data}")

    # Match logged-in Frappe user with Employee user_id
    employee = next(
        (
            emp for emp in employee_data
            if emp.get("user_id") == user
        ),
        None
    )
    
    # frappe.throw(f"{employee}")

    if not employee and user !="Administrator":
        frappe.throw(
            f"No Employee found for logged-in user: {user}"
        )

    employee_name = "Administrator" if user == "Administrator" else employee.get("user_id")

    # Base filter - only logged-in employee's visits
    
    if user == "Administrator":
        filters = {}
    else:
        filters = {
            "sales_person": employee.get("user_id")
        }

    # Client Type
    if client_type:
        filters["client_type"] = client_type

    # Client
    if client:
        filters["client"] = client

    # Date filters
    if from_date and to_date:
        filters["visit_date"] = [
            "between",
            [from_date, to_date]
        ]
    elif from_date:
        filters["visit_date"] = [
            ">=",
            from_date
        ]
    elif to_date:
        filters["visit_date"] = [
            "<=",
            to_date
        ]

    # Get DVR records
    dvr_list = frappe.get_all(
        "Daily Visit Report",
        filters=filters,
        fields=[
            "name",
            "sales_person",
            "branch",
            "client",
            "client_type",
            "visit_type",
            "party_name",
            "sales_executive_name",
            "purpose",
            "visit_photo",
            "sales_gm",
            "visit_date",
            "creation",
            "next_visit_date",
            "approval_status",
            "approved_by",
            "manager_remarks"
        ],
        order_by="visit_date desc, creation desc"
    )

    return dvr_list


@frappe.whitelist(allow_guest=True)
def get_dvr_for_approval_new_client(
    client: str | None = None,
    from_date: str | None = None,
    to_date: str | None = None
):
    user = frappe.session.user
    
    # frappe.throw(f"{user}")

    if user == "Guest":
        frappe.throw("Please login first")

    # Get Employee data from API
    response = requests.get(
        "http://ec2-13-234-27-130.ap-south-1.compute.amazonaws.com:8002/api/method/get_employee_from_gk",
        timeout=10
    )

    response.raise_for_status()

    employee_data = response.json().get("message", [])
    
    # frappe.throw(f"{employee_data}")

    # Match logged-in Frappe user with Employee user_id
    employee = next(
        (
            emp for emp in employee_data
            if emp.get("user_id") == user
        ),
        None
    )
    
    # frappe.throw(f"{employee}")

    if not employee and user !="Administrator":
        frappe.throw(
            f"No Employee found for logged-in user: {user}"
        )

    employee_name = "Administrator" if user == "Administrator" else employee.get("user_id")

    # Base filter - only logged-in employee's visits
    
    if user == "Administrator":
        filters = {}
    else:
        filters = {
            "sales_person": employee.get("user_id")
        }

    # Client Type
    
    # filters["client_type"] = "New Client"
    
    # filters["sub_lead"] = 0

    # Client
    if client:
        filters["client"] = client

    # Date filters
    if from_date and to_date:
        filters["visit_date"] = [
            "between",
            [from_date, to_date]
        ]
    elif from_date:
        filters["visit_date"] = [
            ">=",
            from_date
        ]
    elif to_date:
        filters["visit_date"] = [
            "<=",
            to_date
        ]

    # Get DVR records
    dvr_list = frappe.get_all(
        "Daily Visit Report",
        filters=filters,
        fields=[
            "name",
            "sales_person",
            "branch",
            "client",
            "client_type",
            "visit_type",
            "purpose",
            "visit_photo",
            "party_name",
            "sales_gm",
            "visit_date",
            "creation",
            "next_visit_date",
            "approval_status",
            "approved_by",
            "manager_remarks"
        ],
        order_by="visit_date desc, creation desc"
    )

    return dvr_list
# def get_dvr_for_approval(
#     client_type: str | None = None,
#     client: str | None = None,
#     from_date: str | None = None,
#     to_date: str | None = None
# ):
#     filters = {}

#     # Client Type filter
#     if client_type:
#         filters["client_type"] = client_type

#     # Client filter
#     if client:
#         filters["client"] = client

#     # Date filter
#     if from_date and to_date:
#         filters["visit_date"] = ["between", [from_date, to_date]]

#     elif from_date:
#         filters["visit_date"] = [">=", from_date]

#     elif to_date:
#         filters["visit_date"] = ["<=", to_date]


#     # Pending + Approved + Rejected
#     # Agar sirf pending chahiye to yaha filter laga sakte ho
#     dvr_list = frappe.get_all(
#         "Daily Visit Report",
#         filters=filters,
#         fields=[
#             "name",
#             "sales_person",
#             "branch",
#             "client",
#             "client_type",
#             "visit_type",
#             "purpose",
#             "visit_photo",
#             "sales_gm",
#             "visit_date",
#             "creation",
#             "next_visit_date",
#             "approval_status",
#             "review",
#             "approved_by",
#             "manager_remarks"
#         ],
#         order_by="visit_date desc, creation desc"
#     )

#     return dvr_list


# import frappe


@frappe.whitelist(allow_guest=True)
def update_dvr_status(name: str, status: str):
    
    user = frappe.session.user
    
    if user != "Administrator":
        frappe.throw("Permission Denied")
        
    if not name:
        frappe.throw("DVR Name is required")

    if status not in ["Approved", "Rejected"]:
        frappe.throw("Invalid status")

    dvr = frappe.get_doc("Daily Visit Report", name)

    dvr.approval_status = status

    dvr.save(ignore_permissions=True)

    frappe.db.commit()

    return {
        "success": True,
        "name": dvr.name,
        "approval_status": dvr.approval_status
    }
    
    
@frappe.whitelist(allow_guest=True)
def save_dvr_remarks(name: str, remarks: str | None = None):
    
    user = frappe.session.user
    
    if user != "Administrator":
        frappe.throw("Permission Denied")

    if not name:
        frappe.throw("DVR Name is required")

    dvr = frappe.get_doc("Daily Visit Report", name)

    dvr.manager_remarks = remarks or ""

    dvr.save(ignore_permissions=True)

    frappe.db.commit()

    return {
        "success": True,
        "name": dvr.name,
        "manager_remarks": dvr.manager_remarks
    }
    
    
@frappe.whitelist(allow_guest=True)
def save_dvr_review(name: str, reviewed: int = 0):
    
    user = frappe.session.user
    
    if user != "Administrator":
        frappe.throw("Permission Denied")

    if not name:
        frappe.throw("DVR Name is required")

    dvr = frappe.get_doc(
        "Daily Visit Report",
        name
    )

    dvr.review = int(reviewed)

    dvr.save(
        ignore_permissions=True
    )

    frappe.db.commit()

    return {
        "success": True,
        "name": dvr.name,
        "review": dvr.review
    }
    
    
@frappe.whitelist(allow_guest=True)

def get_my_visit_report(
    from_date: str | None = None,
    to_date: str | None = None,
    visit_type: str | None = None,
    client_type: str | None = None,
    client: str | None = None
):

    user = frappe.session.user

    if user == "Guest":
        frappe.throw("Please login first")

    # Logged-in User -> Employee
    employee = frappe.db.get_value(
        "Employee",
        {"user_id": user},
        "name"
    )

    if not employee:
        frappe.throw(
            "No Employee is linked with the logged-in user"
        )

    # Only logged-in employee's visits
    filters = {
        "sales_person": employee
    }

    # Date filters
    if from_date and to_date:
        filters["visit_date"] = [
            "between",
            [from_date, to_date]
        ]

    elif from_date:
        filters["visit_date"] = [
            ">=",
            from_date
        ]

    elif to_date:
        filters["visit_date"] = [
            "<=",
            to_date
        ]

    # Visit Type
    if visit_type and visit_type != "All":
        filters["visit_type"] = visit_type

    # Client Type
    if client_type and client_type != "All":
        filters["client_type"] = client_type

    # Client
    if client and client != "All Clients":
        filters["client"] = client

    visits = frappe.get_all(
        "Daily Visit Report",
        filters=filters,
        fields=[
            "name",
            "visit_date",
            "sales_person",
            "visit_type",
            "client_type",
            "client",
            "approval_status",
            "next_visit_date",
            "next_visit_note",
            "remarks",
            "priority"
        ],
        order_by="visit_date desc"
    )

    # Dashboard counts
    total_visits = len(visits)

    approved = len([
        row for row in visits
        if row.approval_status == "Approved"
    ])

    pending = len([
        row for row in visits
        if row.approval_status == "Pending"
    ])

    rejected = len([
        row for row in visits
        if row.approval_status == "Rejected"
    ])

    return {
        "success": True,
        "user": user,
        "employee": employee,
        "total_visits": total_visits,
        "approved": approved,
        "pending": pending,
        "rejected": rejected,
        "visits": visits
    }
    
    
@frappe.whitelist(allow_guest=True)
def create_dvr_record(
    purpose: str | None = None,
    status: str | None = None,
    selection_made: str | None = None,
    visit_photo: str | None = None,
    discussion: str | None = None,
    products_pitched: str | None = None,
    parent_lead_id: str | None = None,
    # amended_from: str | None = None,
    next_visit_date: str | None = None,
):
    """
    Create a new Sub Lead from Parent DVR.
    """

    missing = []

    if not purpose:
        missing.append(_("Purpose Of Visit"))

    if not status:
        missing.append(_("Status of Visit"))

    if not parent_lead_id:
        missing.append(_("Parent Lead Id"))

    if missing:
        frappe.throw(
            _("The following mandatory fields are missing: {0}").format(
                ", ".join(missing)
            )
        )

    # Create NEW Sub Lead
    doc = frappe.new_doc("Sub lead")

    doc.purpose = purpose
    doc.status = status
    doc.parent_lead_id = parent_lead_id

    if selection_made:
        doc.selection_made = selection_made

    if visit_photo:
        doc.visit_photo = visit_photo

    if discussion:
        doc.discussion = discussion

    if products_pitched:
        doc.products_pitched = products_pitched

    if next_visit_date:
        doc.next_visit_date = next_visit_date

    # if amended_from:
    #     doc.amended_from = amended_from

    doc.insert(ignore_permissions=False)

    frappe.db.commit()

    return doc.as_dict()



from typing import Optional
from frappe import _


@frappe.whitelist()
def get_sub_leads_by_parent(
    parent_lead_id: Optional[str] = None
):
    if not parent_lead_id:
        frappe.throw(_("Parent Lead ID is required"))

    try:
        sub_leads = frappe.get_all(
            "Sub lead",
            filters={
                "parent_lead_id": parent_lead_id
            },
            fields=[
                "name",
                "parent_lead_id",
                "purpose",
                "status",
                "selection_made",
                "visit_photo",
                "discussion",
                "products_pitched",
                "next_visit_date",
                "creation",
                "modified"
            ],
            order_by="creation desc"
        )

        return sub_leads

    except Exception:
        frappe.log_error(
            frappe.get_traceback(),
            "Get Sub Leads By Parent API Error"
        )
        frappe.throw(
            _("Unable to fetch Sub Leads for parent {0}").format(
                parent_lead_id
            )
        )
        
        
@frappe.whitelist(allow_guest=True)
def get_new_client_party_names():
    
    return frappe.get_all(
        "Daily Visit Report",
        filters={
            "client_type": "New Client"
        },
        fields=[
            "party_name"
        ],
        distinct=True,
        order_by="party_name asc"
    )
    
    
    
    
@frappe.whitelist(allow_guest=True)
def get_customer_category_attribute_values():

    url = "https://gkexport.frappe.cloud/api/method/get_customer_category_for_crm"

    try:
        response = requests.get(
            url,
            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        return data.get("message", [])

    except Exception:
        frappe.log_error(
            title="Customer Category API Error",
            message=frappe.get_traceback()
        )

        frappe.throw(
            "Unable to fetch customer categories from GK Export."
        )
        
        
@frappe.whitelist(allow_guest=True)
def get_products_from_gk():

    url = "https://gkexport.frappe.cloud/api/method/crm_product_pitch"

    response = requests.get(
        url,
        timeout=30
    )

    response.raise_for_status()

    data = response.json()

    return data.get("message", [])



@frappe.whitelist(allow_guest=True)
def get_visit_types():
    records = frappe.get_all(
        "Visit Type",
        filters={
            "hide_from_list": 0
        },
        fields=["name"],
        order_by="name asc"
    )

    return [d.name for d in records]