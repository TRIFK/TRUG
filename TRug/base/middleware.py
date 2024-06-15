from django.conf import settings
from django.contrib.auth import logout
from django.shortcuts import redirect
import time


class SessionTimeoutMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            current_time = int(time.time())
            session_expire_seconds = getattr(settings, 'SESSION_EXPIRE_SECONDS', 1800)
            session_expire_after_last_activity = getattr(settings, 'SESSION_EXPIRE_AFTER_LAST_ACTIVITY', True)

            if 'last_activity' in request.session:
                last_activity = request.session['last_activity']
                if current_time - last_activity > session_expire_seconds:
                    logout(request)
                    return redirect(settings.SESSION_TIMEOUT_REDIRECT)

            if session_expire_after_last_activity:
                request.session['last_activity'] = current_time

        response = self.get_response(request)
        return response
