from rest_framework import permissions


class IsVendorOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.is_authenticated

        elif view.action in ['list', 'retrieve']:
            return True

        elif view.action in ['update', 'partial_update', 'destroy']:
            return request.user.is_authenticated or request.user.is_staff
        else:
            return False

    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.merchant == request.user.is_authenticated or request.user.is_staff


class UserPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.is_authenticated

        elif view.action in ['list', 'retrieve']:
            return True

        elif view.action in ['update', 'partial_update',]:
            return request.user.is_authenticated or request.user.is_staff

        if view.action == 'destroy':
            return request.user.is_staff
        else:
            return False

    def has_object_permission(self, request, view, obj):

        if view.action in ['update', 'partial_update',]:
            return obj.merchant == request.user or request.user.is_staff

        if view.action == 'destroy':
            return obj.merchant == request.user.is_staff

        elif request.method in permissions.SAFE_METHODS or view.action == 'retrieve':
            return True
        elif view.action == 'create':
            return request.user.is_authenticated

        else:
            return False
