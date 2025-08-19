import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export function ConfirmedValidator(video: string, article: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const videoControl = formGroup.get(video);
        const articleControl = formGroup.get(article);

        if (!videoControl || !articleControl) {
            return null;
        }

        const videoValue = videoControl.value;
        const articleValue = articleControl.value === '<p></p>' ? '' : articleControl.value;

        const videoRequired = Validators.required(videoControl);
        const articleRequired = Validators.required(articleControl);

        if (videoRequired && articleRequired) {
            return { bothRequired: true };
        }

        if (!videoValue && !articleValue) {
            return { neitherFilled: true };
        }

        if (videoValue || articleValue) {
            videoControl.setErrors(null);
            articleControl.setErrors(null);
        }

        return null;
    };

}
