import { FilesCollection } from 'meteor/ostrio:files';
import SimpleSchema from "simpl-schema";

const Images = new FilesCollection({
    storagePath: 'assets/app/uploads/Images',
    // downloadRoute: '/Images/',
    collectionName: 'Images',
    permissions: 0o755,
    allowClientCode: false,
    cacheControl: 'public, max-age=31536000',
    onbeforeunloadMessage() {
        return 'Upload is still in progress! Upload will be aborted if you leave this page!';
    },
    onBeforeUpload(file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 10485760 && /png|jpe?g/i.test(file.ext)) {
            return true;
        }
        return 'Please upload image, with size equal or less than 10MB';
    }
});
Images.collection.attachSchema(new SimpleSchema(Images.schema));

if(Meteor.isServer) {
    Images.denyClient();
    Meteor.publish('allImages', function () {
        return Images.collection.find({});
    });
}

// Export FilesCollection instance, so it can be imported in other files
export default Images;