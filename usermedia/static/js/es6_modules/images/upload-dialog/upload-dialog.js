import {usermediaUploadCategoryTemplate, usermediaUploadTemplate} from "./templates"

export class ImageUploadDialog {
    constructor(imageDB, imageId, ownerId, callback) {
        this.imageDB = imageDB
        this.imageId = imageId
        this.ownerId = ownerId
        this.callback = callback
        this.createImageUploadDialog()
    }

    //open a dialog for uploading an image
    createImageUploadDialog() {
        let that = this
        let title, imageCat, thumbnail, image, action, longAction
        if (this.imageId) {
            title = this.imageDB.db[this.imageId].title
            thumbnail = this.imageDB.db[this.imageId].thumbnail
            image = this.imageDB.db[this.imageId].image
            imageCat = this.imageDB.db[this.imageId].cats
            action = gettext('Update')
            longAction = gettext('Update image')
        } else {
            this.imageId = 0
            title = ''
            imageCat = []
            thumbnail = false
            image = false
            action = gettext('Upload')
            longAction = gettext('Upload image')
        }

        let iCats = []
        jQuery.each(this.imageDB.cats, function (i, iCat) {
            let len = iCats.length
            iCats[len] = {
                'id': iCat.id,
                'category_title': iCat.category_title
            }
            if (0 <= jQuery.inArray(String(iCat.id), imageCat)) {
                iCats[len].checked = ' checked'
            } else {
                iCats[len].checked = ''
            }
        })

        jQuery('body').append(usermediaUploadTemplate({
            'action': longAction,
            'title': title,
            'thumbnail': thumbnail,
            'image': image,
            'categories': usermediaUploadCategoryTemplate({
                'categories': iCats,
                'fieldTitle': gettext('Select categories')
            })
        }))
        let diaButtons = {}
        diaButtons[action] = function () {
            that.onCreateImageSubmitHandler()
        }
        diaButtons[gettext('Cancel')] = function () {
            jQuery(this).dialog('close')
        }
        jQuery("#uploadimage").dialog({
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: true,
            buttons: diaButtons,
            create: function () {
                let $the_dialog = jQuery(this).closest(".ui-dialog")
                $the_dialog.find(".ui-button:first-child").addClass("fw-button fw-dark")
                $the_dialog.find(".ui-button:last").addClass("fw-button fw-orange")
                that.setMediaUploadEvents(jQuery('#uploadimage'))
            },
            close: function () {
                jQuery("#uploadimage").dialog('destroy').remove()
            }
        })

        jQuery('.fw-checkable-label').bind('click', function () {
            $.setCheckableLabel(jQuery(this))
        })
    }

    //add image upload events
    setMediaUploadEvents(wrapper) {
        let select_button = wrapper.find('.fw-media-select-button'),
            media_input = wrapper.find('.fw-media-file-input'),
            media_previewer = wrapper.find('.figure-preview > div')

        select_button.bind('click', function() {
            media_input.trigger('click')
        })

        media_input.bind('change', function() {
            let file = jQuery(this).prop('files')[0],
                fr = new FileReader()

            fr.onload = function() {
                media_previewer.html('<img src="' + fr.result + '" />')
            }
            fr.readAsDataURL(file)
        })
    }

    onCreateImageSubmitHandler() {
        //when submitted, the values in form elements will be restored
        let formValues = new FormData(),
            checkboxValues = {}

        formValues.append('id', this.imageId)

        if(this.ownerId) {
            formValues.append('owner_id', this.ownerId)
        }

        jQuery('.fw-media-form').each(function () {
            let $this = jQuery(this)
            let the_name = $this.attr('name') || $this.attr('data-field-name')
            let the_type = $this.attr('type') || $this.attr('data-type')
            let the_value = ''

            switch (the_type) {
                case 'checkbox':
                    //if it is a checkbox, the value will be restored as an Array
                    if (undefined == checkboxValues[the_name])
                        checkboxValues[the_name] = []
                    if ($this.prop("checked")) {
                        checkboxValues[the_name].push($this.val())
                    }
                    return
                case 'file':
                    the_value = $this.get(0).files[0]
                    break
                default:
                    the_value = $this.val()
            }

            formValues.append(the_name, the_value)
        })

        // Add the values for check boxes
        for (key in checkboxValues) {
            formValues.append(key, checkboxValues[key].join(','))
        }
        this.createImage(formValues)
    }

    createImage(imageData) {
        let that = this
        this.imageDB.createImage(imageData, function(imageId){
            jQuery("#uploadimage").dialog('close')
            that.imageId = imageId
            that.callback(imageId)
        })
    }

}
